import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from './../../substrate-lib'
import { SubContext } from './../../commons/context/SubContext'
import { u8aToString, hexToU8a } from '@polkadot/util'
import ResponsiveAppBar from './../ResponsiveAppBar'
import axios from 'axios'
import {IPFS_URL} from "./../../commons/config/configvar"
import { CardMedia } from '@mui/material'
// import { useParams } from "react-router-dom";

function ApiQuery() {
  const [status, setStatus] = useState(0)

  const { api } = useSubstrateState()
  const [ipfsData, setProfileData] = useState(null)
  // const params = useParams();
  const { userId } = useContext(SubContext)

  // console.log("id", params.id)

  useEffect(() => {
    const queryResHandler = async result => {
      if (result.isNone) {
        setStatus('None')
      } else {

        const hash = u8aToString(hexToU8a(JSON.parse(result.toString()).profileHash))
        setStatus(hash)
        const ipfsresult = await axios(`${IPFS_URL}${hash}`)
        console.log(ipfsresult.data)
        setProfileData(ipfsresult.data)

      }

      console.log('status', status)
    }
    async function myfn() {
      const opts = [userId]
      if (userId !== null) {
        let data = api.query.templateModule.citizenProfile(
          ...opts,
          queryResHandler
        )
        console.log(data)
      } else {
        setStatus('None')
      }
    }

    myfn()
  }, [api, userId, status])

  return (
    <React.Fragment>
      {' '}
      <ResponsiveAppBar /> userid: {userId} {status && <p>{status}</p>}{' '}
      
      {ipfsData && (
        <React.Fragment>
          <p>Name: {ipfsData.name}</p>
      {ipfsData.details}
          <CardMedia
            component="video"
            controls 
            src={`https://gateway.ipfs.io/ipfs/${ipfsData.video}`}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ApiQuery
