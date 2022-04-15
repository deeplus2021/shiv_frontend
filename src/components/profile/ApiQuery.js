import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from './../../substrate-lib'
import { SubContext } from './../../commons/context/SubContext'
import {u8aToString, hexToU8a } from "@polkadot/util"

function ApiQuery() {
  const [status, setStatus] = useState(0)
  const { api } = useSubstrateState()
  const { userId } = useContext(SubContext)

  const queryResHandler = result =>  {
    result.isNone ? setStatus('None') : setStatus(u8aToString(hexToU8a(JSON.parse(result.toString()).profileHash)))
    console.log("status",status)
  }
  useEffect(() => {
    async function myfn() {
      const opts = [userId]
      let data = api.query.templateModule.citizenProfile(...opts, queryResHandler)
      console.log(data)
    }

    myfn()
  }, [api])

  return <React.Fragment>userid: {userId} {status && <p>{status}</p>} </React.Fragment>
}

export default ApiQuery
