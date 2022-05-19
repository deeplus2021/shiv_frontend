import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { useParams } from 'react-router-dom'
// import AppPagination from './AppPagination'
import config from '../../config'
import rpcdata from '../../commons/rpcdata/rpcdata.js'
import ChallengeEvidenceGet from './ChallengeEvidenceGet'
import ChallengePostComment from './ChallengePostComment';

function ChallengeEvidenceView() {
  const [status, setStatus] = useState(0)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)
  const [challengeIds, setChallengeIds] = useState(null)
  const { api } = useSubstrateState()
  const params = useParams()
  useEffect(() => {
    async function myfn() {
      const no_of_items = 20
      let end = page * no_of_items
      let start = end - no_of_items
      const wsProvider = new WsProvider(config.PROVIDER_SOCKET)
      // console.log(rpcdata)

      const api2 = await ApiPromise.create({
        provider: wsProvider,
        rpc: rpcdata,
      })
      // let methods = await api2.rpc.rpc.methods();
      // console.log(methods)

      let result = await api2.rpc.shivarthu.challengerevidence(
        params.id,
        start,
        no_of_items
      )
      console.log(result.toString())
      console.log('id', params.id)
      console.log('start', start)
      let chid = JSON.parse(result.toString())
      setChallengeIds(chid)
      console.log(chid)
      // console.log("chaollengeid:", challengeIds)
      // console.log('chid', challengeIds)

      // const opts = [{"UniqueIdenfier1":[params.id,"challengeprofile"]}]
      // if (params.id !== null) {
      // let data = api.query.templateModule.periodName(
      //     ...opts,
      //     queryResHandler
      //   )
      // } else {
      //     setStatus(null)
      // }
    }

    myfn()
  }, [api, status, params.id, page])
  return (
    <React.Fragment>
      <br />
      {challengeIds &&
        challengeIds.map(item => (
          <div key={item}>      
            <ChallengeEvidenceGet cid={item} />
            <ChallengePostComment cid={item} />
          </div>
        ))}
      {/* <AppPagination setPage={setPage} pageCount={pageCount} /> */}
    </React.Fragment>
  )
}

export default ChallengeEvidenceView
