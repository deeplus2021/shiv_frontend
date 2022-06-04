import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { useParams } from "react-router-dom"
import ChallengeProfileFees from './ChallengeProfileFees'

   
   
function SchellingGame() {
    const [status, setStatus] = useState(0)
    const { api } = useSubstrateState()
    const params = useParams();
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
        const opts = [{"UniqueIdenfier1":[params.id,"challengeprofile"]}]
        if (params.id !== null) {
        let data = api.query.templateModule.periodName(
            ...opts,
            queryResHandler
          )
        } else {
            setStatus(null)
        }
    }
  
    myfn()
  }, [api, status, params.id])

  let myview;
  if(status === "Evidence") {
      myview = <ChallengeProfileFees id={params.id}/>
  }
      return (
          <React.Fragment>
            <br/>
             {status && <div><div>Period: {status}</div>
             {myview}</div>}
           </React.Fragment>
       );
}
  
  
export default SchellingGame
