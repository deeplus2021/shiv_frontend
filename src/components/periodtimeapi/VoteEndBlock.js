import React, { useState, useEffect, useContext } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { useParams } from 'react-router-dom'
import config from '../../config'
import rpcdata from '../../commons/rpcdata/rpcdata.js'
import Container from '@mui/material/Container'

function VoteEndBlock(props) {
  const [data, setData] = useState(null)
  useEffect(() => {
    async function myfn() {
      const wsProvider = new WsProvider(config.PROVIDER_SOCKET)
      const api2 = await ApiPromise.create({
        provider: wsProvider,
        rpc: rpcdata,
      })
      let result = await api2.rpc.shivarthu.voteendblock(props.id)
      setData(result.toString())
    }

    myfn()
    const interval = setInterval(() => {
      myfn()
    }, 10000)

    return () => clearInterval(interval)
  }, [props])

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <br />
        {data && <div>{data}</div>}
      </Container>
    </React.Fragment>
  )
}

export default VoteEndBlock
