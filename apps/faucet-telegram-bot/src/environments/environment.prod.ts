import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  production: true,
  chainUrl: process.env.BHOLDUS_CHAIN_URL,
  sudoPhrase: process.env.BHOLDUS_SUDO_PHRASE,
  sendingAccount: process.env.BHOLDUS_SENDING_ACCOUNT,
  telegramKey: process.env.TELEGRAM_KEY,
};
