import {} from '@polkadot/api/types';

const definitions: any = {
  alias: {},
  types: [
    {
      minmax: [0, undefined],
      types: {
        BalanceUnlockPercent: 'u8',
        BlockNumberFor: 'u32',
        LockIdentifier: '[u8; 8]',
        RoundId: 'u32',
        BalanceLockSetting: {
          unlock_percents: 'Vec<BalanceUnlockPercent>',
          lock_durations: 'Vec<BlockNumber>',
          lock_identifiers: 'Vec<LockIdentifier>',
          min_transfer_amount: 'Option<Balance>',
          max_transfer_amount: 'Option<Balance>',
        },
      },
    },
  ],
};

export const spec: any = {
  bholdus: definitions,
};
