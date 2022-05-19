import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { useParams } from 'react-router-dom'
import ChallengeEvidenceGet from './ChallengeEvidenceGet'

function ChallengePostComment(props) {
  const [status, setStatus] = useState(null)
  const [commentids, setCommentIds] = useState(null)
  const { api } = useSubstrateState()
  const params = useParams()
  useEffect(() => {
    const queryResHandler = async result => {
      if (result.isNone) {
        setStatus(null)
      } else {
        setStatus(result.toString())
        let chid = JSON.parse(result.toString())
        setCommentIds(chid)
        console.log(chid)
        
      }

      //   console.log('commentids', commentids)
    }
    async function myfn() {
      const opts = [props.cid]
      let data = await api.query.templateModule.challengePostCommentIds(
        ...opts,
        queryResHandler
      )
      
    }

    myfn()
  }, [api, status, props.cid])
  return (
    <React.Fragment>
      <br />
      {commentids &&
        commentids.map(item => (
          <div key={item}>
            <ChallengeEvidenceGet cid={item} />
          </div>
        ))}
    </React.Fragment>
  )
}

export default ChallengePostComment
