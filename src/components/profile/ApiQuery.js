import React, { useState, useEffect } from 'react'
import { useSubstrateState } from './../../substrate-lib'

function ApiQuery() {
  const [status, setStatus] = useState(0)
  const { api } = useSubstrateState()

  const queryResHandler = result =>
    result.isNone ? setStatus('None') : setStatus(result.toString())
  useEffect(() => {
    async function myfn() {
      const opts = []
      let data = api.query.templateModule.helloWorld(...opts, queryResHandler)
      console.log(data)
    }

    myfn()
  }, [api.query.templateModule])
  return <React.Fragment>{status}</React.Fragment>
}

export default ApiQuery
