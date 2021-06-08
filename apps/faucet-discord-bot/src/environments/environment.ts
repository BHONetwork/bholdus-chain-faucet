import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.local.env' });

export const environment = {
  production: false,
  chainUrl: 'ws://127.0.0.1:9944',
  sudoPhrase: '//Alice',
  sendingAccount: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
};
