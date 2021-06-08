import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';

type ApiOptions = {
  chainUrl: string;
};

export enum ConnectionState {}

export class FaucetApi {
  private readonly chainUrl: string;
  private readonly api: ApiPromise;
  private readonly wsProvider: WsProvider;
  private readonly connectionState: ConnectionState;
  readonly isReady: Promise<FaucetApi>;

  constructor(apiOptions: ApiOptions) {
    this.chainUrl = apiOptions.chainUrl;
    this.wsProvider = new WsProvider(this.chainUrl);
    this.api = new ApiPromise({ provider: this.wsProvider });
    this.isReady = this.api.isReady.then(() => this);

    this.api.on('connected', () => {
      console.info('Faucet Api: connected');
    });
    this.api.on('disconnected', () => {
      console.info('Faucet Api: disconnected');
    });
    this.api.on('error', () => {
      console.info('Faucet Api: error');
    });
    this.api.on('ready', () => {
      console.info('Faucet Api: ready');
    });
  }

  /**
   * Fund specified amount to a user. This operation is conducted with sudo permission.
   *
   * @param sudoPhrase Sudo phrase to conduct transaction
   * @param fromAddr Address sending funds
   * @param toAddr Address receiving the funds
   * @param amount Amount of funds in unit
   */
  async fund(sudoPhrase: string, fromAddr: string, toAddr: string, amount = 1) {
    await this.api.isReady;
    const keyring = new Keyring({ type: 'sr25519' });

    const [tokenDecimals] = this.api.registry.chainDecimals;
    const [tokenSymbols] = this.api.registry.chainTokens;
    const sudoPair = keyring.addFromUri(sudoPhrase);

    console.info(
      `Sending ${amount} ${tokenSymbols} from ${fromAddr} to ${toAddr}`
    );

    await this.api.tx.sudo
      .sudoUncheckedWeight(
        this.api.tx.balances.forceTransfer(
          fromAddr,
          toAddr,
          amount * Math.pow(10, tokenDecimals)
        ),
        0
      )
      .signAndSend(sudoPair);
  }
}
