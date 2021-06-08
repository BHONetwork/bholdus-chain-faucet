import { Telegraf } from "telegraf";
import { fundToken } from "./mockFunction"

const bot = new Telegraf('1853984481:AAH5BrAsw-lXGVbR_2otl7BzG5gDn-PNLls');

bot.start((ctx) =>
  ctx.reply(
    "Welcome to Bholdus Faucet Bot! Please enter your Bholdus testnet address to receive some funds!"
  )
);

bot.on("text", async (ctx) => {
  console.log(ctx);
  // check if address is valid
  if (!ctx.message.text) {
    ctx.reply("Invalid account address");
  } else {
    ctx.reply("We are processing your request, please wait...");
    // call request
    const respone = await fundToken(ctx.message.text)
    
    if (respone.status === "success") {
      ctx.reply(`We have successfully funded the account ${ctx.message.text}`);
    } else {
      ctx.reply(
        `We have error funding your account, please insert your address to try again`
      );
    }
  }
});
bot.launch();

