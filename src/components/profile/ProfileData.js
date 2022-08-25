import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { SubContext } from '../../commons/context/SubContext'
import { u8aToString, hexToU8a } from '@polkadot/util'
import ResponsiveAppBar from '../ResponsiveAppBar'
import axios from 'axios'
import { IPFS_URL } from '../../commons/config/configvar'
import { CardMedia } from '@mui/material'
import Container from '@mui/material/Container'
import { Link } from 'react-router-dom'
import longword from './LongWords.css'
import './ProfileById.css'
import Grid from '@mui/material/Grid'
import sanitizeHtml from 'sanitize-html-react'
// import { useParams } from "react-router-dom";

function ProfileData() {
  const [status, setStatus] = useState(0)
  const [loading, setLoading] = useState(true)

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
        const hash = u8aToString(
          hexToU8a(JSON.parse(result.toString()).profileHash)
        )
        setStatus(hash)
        const ipfsresult = await axios(`${IPFS_URL}${hash}`)
        console.log(ipfsresult.data)
        setLoading(false)
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
        setProfileData(null)
      }
    }

    myfn()
  }, [api, userId, status])

  const Style = {
    height: 600,
  };

  return (
    <React.Fragment>
      {' '}
      <ResponsiveAppBar />
      {/* userid: {userId} {status && <p>{status}</p>}{' '} */}
      <br />
      <br />
      {loading && (<div>Loading... </div>)}
      {ipfsData && (
        <React.Fragment>
          <Container maxWidth="xl">
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Link to={`/profile/${userId}`}>Public Profile</Link>
            </Grid>
            <p>Name: {ipfsData.name}</p>
            <div
              className={`details ${longword.linebreaks} ${longword.wraplongworld}`}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(ipfsData.details) }}
            />

            <br />
          </Container>
          <Container maxWidth="lg">
            <CardMedia
            style={Style}
              component="video"
              controls
              src={`${IPFS_URL}${ipfsData.video}`}
            />
          </Container>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ProfileData
