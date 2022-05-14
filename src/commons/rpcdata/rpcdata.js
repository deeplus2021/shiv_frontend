const rpcdata = {
  shivarthu: {
    challengerevidence: {
      description: 'Challenger Evidence',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'offset',
          type: 'u64',
        },
        {
          name: 'limit',
          type: 'u16',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Vec<u128>',
    },
  },
}

export default rpcdata
