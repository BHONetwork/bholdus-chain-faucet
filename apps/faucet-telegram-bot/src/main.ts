import { Telegraf } from 'telegraf';
import { promisify } from 'util'
import { FaucetApi } from '@bholdus-chain-faucet/faucet-api';
import { environment } from './environments/environment';
import redis = require("redis");

const client = redis.createClient();
const existsAsync = promisify(client.exists).bind(client);
const ttl = promisify(client.ttl).bind(client);

const expiredTime = 259200 //259200 in seconds => 3 days
const bot = new Telegraf(environment.telegramKey);

const faucetApi = new FaucetApi({ chainUrl: environment.chainUrl });

bot.start((ctx) =>
  ctx.reply(
    'Welcome to Bholdus Faucet Bot! Enter: /fund <address> to receive some funds for your Bholdus testnet account!'
  )
);

bot.on('text', async (ctx) => {
  const args = ctx.message.text.split(' ');
  const command = args.shift().toLowerCase();
  const address = args.shift();
  // check if address is valid
  if (command !== '/fund') {
    ctx.reply(
      'Invalid command! Enter: /fund <address> to receive some funds for your Bholdus testnet account!'
    );
    return;
  }
  if (!address) {
    ctx.reply('Invalid account address');
    return;
  }

  const isValidAddress = await FaucetApi.isValidAddress(address);
  if (!isValidAddress) {
    return ctx.reply('Invalid address');
  }

  const isFunded = await existsAsync(address)

  if (isFunded) {
    const remainingTime = await ttl('key'); 
    return ctx.reply(`We have funded this address recently, please try again after ${remainingTime} seconds!`);
  }

  const fundAmount = 100;

  ctx.reply('We are processing your request, please wait...');

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
    client.set(address, true, 'EX', expiredTime);
    ctx.reply(
      `We have successfully funded ${fundAmount} ${faucetApi.tokenSymbol} the account ${ctx.message.text}`
    );
  } else {
    ctx.reply(
      `We have error funding your account, please insert your address to try again`
    );
  }
});
bot.launch();
