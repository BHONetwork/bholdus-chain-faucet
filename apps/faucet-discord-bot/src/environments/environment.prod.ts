import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const environment = {
  production: true,
  chainUrl: 'ws://127.0.0.1:9944',
  sudoPhrase: '//Alice',
  sendingAccount: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
};
