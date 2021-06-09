import { Telegraf } from 'telegraf';
import { FaucetApi } from '@bholdus-chain-faucet/faucet-api';
import { environment } from './environments/environment';

const bot = new Telegraf(environment.telegramKey);

const faucetApi = new FaucetApi({ chainUrl: environment.chainUrl });

bot.start((ctx) =>
  ctx.reply(
    'Welcome to Bholdus Faucet Bot! Please enter your Bholdus testnet address to receive some funds!'
  )
);

bot.on('text', async (ctx) => {
  console.log(ctx);
  // check if address is valid
  if (!ctx.message.text) {
    ctx.reply('Invalid account address');
  } else {
    ctx.reply('We are processing your request, please wait...');
    const address = ctx.message.text;

    // call request
    await faucetApi.isReady;

    const response = await faucetApi
      .fund(environment.sudoPhrase, environment.sendingAccount, address)
      .then(() => ({ status: 'success' }))
      .catch(() => ({ status: 'error' }));

    if (response.status === 'success') {
      ctx.reply(`We have successfully funded the account ${ctx.message.text}`);
    } else {
      ctx.reply(
        `We have error funding your account, please insert your address to try again`
      );
    }
  }
});
bot.launch();
