import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ApiPromise, WsProvider } from '@polkadot/api'
import ResponsiveAppBar from '../ResponsiveAppBar'
import config from '../../config'
import rpcdata from '../../commons/rpcdata/rpcdata.js'

function Candidates() {
  const [status, setStatus] = useState(null)
  const params = useParams()
  useEffect(() => {
    async function myfn() {
      const wsProvider = new WsProvider(config.PROVIDER_SOCKET)
      const api2 = await ApiPromise.create({
        provider: wsProvider,
        rpc: rpcdata,
      })
      let result = await api2.rpc.election.candidateids(params.dpid)
      setStatus(result.toString())
      console.log(result.toString())
    }

    myfn()
  }, [params.dpid, status])
  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <br />
      <br />
      {status &&
        status
          .slice(1, -1)
          .split(',')
          .map(item => <p key={item}>{item}</p>)}
    </React.Fragment>
  )
}

export default Candidates
