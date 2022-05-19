import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { useParams } from 'react-router-dom'
import { u8aToString, hexToU8a } from '@polkadot/util'
import { IPFS_URL } from '../../commons/config/configvar'
import axios from 'axios'
import longword from './LongWords.css'
import sanitizeHtml from 'sanitize-html-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function ChallengeEvidenceGet(props) {
  const [status, setStatus] = useState(null)
  const [challengeData, setChallengeData] = useState(null)
  const [authorAccountId, setAuthorAccountId] = useState(null)
  const { api } = useSubstrateState()
  useEffect(() => {
    const queryResHandler = async result => {
      if (result.isNone) {
        setStatus(null)
      } else {
        console.log(result.toString())
        const hashbytes = JSON.parse(result.toString()).postHash
        const authorAccount= JSON.parse(result.toString()).authorAccountId
        const hash = u8aToString(hexToU8a(hashbytes))
        setStatus(hash)
        setAuthorAccountId(authorAccount)
        const ipfsresult = await axios(`${IPFS_URL}${hash}`)
        console.log(ipfsresult.data)
        setChallengeData(ipfsresult.data)
      }

      // console.log('status', status)
    }
    async function myfn() {
      const opts = [props.cid]
        let data = api.query.templateModule.challengePost(
          ...opts,
          queryResHandler
        )
      }

    myfn()
  }, [api, props])
  return (
    <React.Fragment>
      <br />
      {/* {status && <p>Period: {status}</p>} */}
      { challengeData && (
        <React.Fragment>
        <div
          className={`details ${longword.linebreaks} ${longword.wraplongworld}`}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(challengeData.details) }}
        />
        {authorAccountId && <div>AccountId: {authorAccountId}</div> }
        </React.Fragment>
      ) || <Skeleton count={3}/>}
    </React.Fragment>
  )
}

export default ChallengeEvidenceGet
