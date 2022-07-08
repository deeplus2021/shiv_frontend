import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { useParams } from 'react-router-dom'
import ChallengeProfileFees from './ChallengeProfileFees'
import ApplyJurors from './ApplyJurors'
import ResponsiveAppBar from '../ResponsiveAppBar'
import DrawJurors from './DrawJurors'
import CommitVote from './CommitVote'
import RevealVote from './RevealVote'
import GetIncentives from './GetIncentives'

function SchellingGame() {
  const [status, setStatus] = useState(0)
  const { api } = useSubstrateState()
  const params = useParams()
  useEffect(() => {
    const queryResHandler = async result => {
      if (result.isNone) {
        setStatus(null)
      } else {
        setStatus(result.toString())
      }

      console.log('status', status)
    }
    async function myfn() {
      const opts = [{ UniqueIdenfier1: [params.id, 'challengeprofile'] }]
      if (params.id !== null) {
        let data = api.query.templateModule.periodName(...opts, queryResHandler)
      } else {
        setStatus(null)
      }
    }

    myfn()
  }, [api, status, params.id])

  let myview
  if (status === 'Evidence') {
    myview = <ChallengeProfileFees id={params.id} />
  } else if (status === 'Staking') {
    myview = <ApplyJurors id={params.id} />
  } else if (status === 'Drawing') {
    myview = <DrawJurors id={params.id} />
  } else if (status === 'Commit') {
    myview = <CommitVote id={params.id} />
  } else if (status === 'Vote') {
    myview = <RevealVote id={params.id} />
  } else if (status === 'Execution') {
    myview = <GetIncentives id={params.id} />
  }
  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <br />
      {status && (
        <div>
          <div>Period: {status}</div>
          {myview}
        </div>
      )}
    </React.Fragment>
  )
}

export default SchellingGame
