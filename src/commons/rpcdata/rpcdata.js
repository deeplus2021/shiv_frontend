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
    evidenceperiodendblock: {
      description: 'Evidence period end block',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Option<u32>',
    },
    stakingperiodendblock: {
      description: 'Staking period end block',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Option<u32>',
    },
    drawingperiodend: {
      description: 'Drawing period end block',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: '(u64, u64, bool)',
    },
    commitendblock: {
      description: 'Commit period end block',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Option<u32>',
    },
    voteendblock: {
      description: 'Vote period end block',
      params: [
        {
          name: 'profile_citizenid',
          type: 'u128',
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Option<u32>',
    },

  },
  election: {
    candidateids: {
      description: "Candidate Ids",
      params: [
        {
          name: 'departmentid',
          type: 'u128'
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Vec<AccountId>'
    },

    membersids: {
      description: "Members Ids",
      params: [
        {
          name: 'departmentid',
          type: 'u128'
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Vec<AccountId>'
    },

    runnersupids: {
      description: "Runners Up Ids",
      params: [
        {
          name: 'departmentid',
          type: 'u128'
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true,
          isHistoric: true,
        },
      ],
      type: 'Vec<AccountId>'
    },

  }
}

export default rpcdata
