import Discord = require('discord.js');
import { promisify } from 'util'
import { environment } from './environments/environment';
import { FaucetApi } from '@bholdus-chain-faucet/faucet-api';
import redis = require("redis");

const redisClient = redis.createClient();
const existsAsync = promisify(redisClient.exists).bind(redisClient);
const ttl = promisify(redisClient.ttl).bind(redisClient);

const client = new Discord.Client();

const prefix = '/';

const expiredTime = 259200 //259200 in seconds => 3 days

const faucetApi = new FaucetApi({ chainUrl: environment.chainUrl });

console.log(`NODE_ENV=${process.env.NODE_ENV}`);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async function (message) {
  try {
    if (message.author.bot) return; // check if bot msg
    if (!message.content.startsWith(prefix)) {
      message.reply(
        'Use this syntax to fund your testnet account: /fund <address>.'
      );
      return; // check if it is a command
    }

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'fund') {
      const address = args.shift();
      // Check address validity
      if (!address) {
        message.reply('Invalid address');
      } else {
        const isValidAddress = await FaucetApi.isValidAddress(address);
        if (!isValidAddress) {
          return message.reply('Invalid address');
        }

        const isFunded = await existsAsync(address)

        if (isFunded) {
          const remainingTime = await ttl(address); 
          return message.reply(`We have funded this address recently, please try again after ${remainingTime} seconds!`);
        }

        const fundAmount = 100;

        message.reply('We are processing your request, please wait...');
        // call request
        await faucetApi.isReady;

        const response = await faucetApi
          .fund(
            environment.sudoPhrase,
            environment.sendingAccount,
            address,
            fundAmount
          )
          .then(() => ({ status: 'success' }))
          .catch(() => ({ status: 'error' }));

        if (response.status === 'success') {
          redisClient.set(address, true, 'EX', expiredTime);
          message.reply(
            `We have successfully funded ${fundAmount} ${faucetApi.tokenSymbol} the account ${address}`
          );
        } else {
          message.reply(
            `We have error funding your account, please insert your address to try again`
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

client.login(environment.discordKey);
