import React, { useState, useEffect, useContext } from 'react'
import { useSubstrateState } from '../../substrate-lib'
import { useParams } from "react-router-dom"

   
   
function PeriodName() {
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
      return (
          <React.Fragment>
            <br/>
             {status && <p>Period: {status}</p>}
           </React.Fragment>
       );
}
  
  
export default PeriodName
