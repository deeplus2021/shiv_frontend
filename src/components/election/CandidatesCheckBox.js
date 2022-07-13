import React, { useState, useEffect, useContext } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'

import config from '../../config'
import rpcdata from '../../commons/rpcdata/rpcdata.js'
import { Formik, Field, Form } from 'formik'

function CandidatesCheckBox(props) {
  const [status, setStatus] = useState(null)
  
  useEffect(() => {
    async function myfn() {
      const wsProvider = new WsProvider(config.PROVIDER_SOCKET)
      const api2 = await ApiPromise.create({
        provider: wsProvider,
        rpc: rpcdata,
      })
      let result = await api2.rpc.election.candidateids(props.dpid)
      setStatus(result.toString())
      console.log(result.toString())
    }

    myfn()
  }, [props, status])
  return (
    <React.Fragment>
    
      <br />
      <br />
      {status &&
        status
          .slice(1, -1)
          .split(',')
          .map(item => (
            <p key={item}>
              <label>
                <Field type="checkbox" name="votes" value={item} />
                {item}
              </label>
            </p>
          ))}
    </React.Fragment>
  )
}

export default CandidatesCheckBox
