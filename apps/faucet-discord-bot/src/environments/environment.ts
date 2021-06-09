import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  production: false,
  chainUrl: 'ws://127.0.0.1:9944',
  sudoPhrase: '//Alice',
  sendingAccount: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  discordKey: process.env.DISCORD_KEY,
};
