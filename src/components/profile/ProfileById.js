import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { u8aToString, hexToU8a } from '@polkadot/util'
import ResponsiveAppBar from '../ResponsiveAppBar'
import axios from 'axios'
import { IPFS_URL } from '../../commons/config/configvar'
import { CardMedia } from '@mui/material'
import Container from '@mui/material/Container'
import longword from './LongWords.css'
import { useParams } from "react-router-dom";
import PayProfileFees from './PayProfileFees'
import PeriodName from './PeriodName'

function ProfileById() {
  const [status, setStatus] = useState(0)

  const { api } = useSubstrateState()
  const [ipfsData, setProfileData] = useState(null)
  const params = useParams();

  // console.log("id", params.id)

  useEffect(() => {
    const queryResHandler = async result => {
      if (result.isNone) {
        setStatus('None')
        setProfileData(null)
      } else {
        const hash = u8aToString(
          hexToU8a(JSON.parse(result.toString()).profileHash)
        )
        setStatus(hash)
        const ipfsresult = await axios(`${IPFS_URL}${hash}`)
        console.log(ipfsresult.data)
        setProfileData(ipfsresult.data)
      }

      console.log('status', status)
    }
    async function myfn() {
      const opts = [params.id]
      if (params.id !== null) {
        let data = api.query.templateModule.citizenProfile(
          ...opts,
          queryResHandler
        )
        console.log(data)
      } else {
        setStatus('None')
        setProfileData(null)
      }
    }

    myfn()
  }, [api, params, status])

  return (
    <React.Fragment>
      {' '}
      <ResponsiveAppBar />
      {/* userid: {userId} {status && <p>{status}</p>}{' '} */}
      <br />
      <br />
      {ipfsData && (
        <React.Fragment>
          <Container maxWidth="xl">
            <p>Name: {ipfsData.name}</p>
            <div
              className={`details ${longword.linebreaks} ${longword.wraplongworld}`}
              dangerouslySetInnerHTML={{ __html: ipfsData.details }}
            />

            <br />
          </Container>
          <Container maxWidth="lg">
            <CardMedia
              component="video"
              controls
              src={`${IPFS_URL}${ipfsData.video}`}
            />
          </Container>
          <PayProfileFees/>
          <PeriodName />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ProfileById
