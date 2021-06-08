const Discord = require('discord.js');
import { fundToken } from "./mockFunction"

const client = new Discord.Client();

const prefix = "/";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  

client.on("message", async function (message) {
  if (message.author.bot) return; // check if bot msg
  if (!message.content.startsWith(prefix)) return; // check if it is a command

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "fund") {
    const address = args.shift()
    // Check address validity
    if (!address) {
        message.reply('Invalid address')
      } else {
        message.reply("We are processing your request, please wait...");
        // call request
        const respone = await fundToken(address)
        
        if (respone.status === "success") {
          message.reply(`We have successfully funded the account ${address}`);
        } else {
          message.reply(
            `We have error funding your account, please insert your address to try again`
          );
        }
      }
  }
});

client.login('ODUxNjYzMDQxOTYzNjIyNDQx.YL7jBA.BjFzYOuu-H4fDl6EgOmVqvvT8rM');
