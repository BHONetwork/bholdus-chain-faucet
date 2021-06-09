import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  production: true,
  chainUrl: process.env.BHOLDUS_CHAIN_URL,
  sudoPhrase: process.env.BHOLDUS_PHRASE,
  sendingAccount: process.env.BHOLDUS_SENDING_ACCOUNT,
  discordKey: process.env.DISCORD_KEY,
};
