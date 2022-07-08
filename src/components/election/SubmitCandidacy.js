import React, { useState } from 'react'
import { useSubstrateState } from './../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { FocusError, SubmittingWheel } from './../../commons/FocusWheel'
import ResponsiveAppBar from '../ResponsiveAppBar'

function SubmitCandidacy() {
  const { api, currentAccount } = useSubstrateState()
  const [status, setStatus] = useState(null)
  const [count, setCount] = useState(0)
  const [errorThrow, setErrorThrow] = useState(false)
  const [unsubValue, setUnsub] = useState(null)
  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }
  const txResHandler = (status, events, dispatchError, setSubmitting) => {
    setSubmitting(true)
    if (dispatchError) {
      setStatus(null)
      if (dispatchError.isModule) {
        // for module errors, we have the section indexed, lookup
        const decoded = api.registry.findMetaError(dispatchError.asModule)
        const { docs, name, section } = decoded

        console.log(`${section}.${name}: ${docs.join(' ')}`)
        setStatus(name)
        setSubmitting(false)
      } else {
        console.log(dispatchError.toString())
      }
    } else if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)

      // navigate('/')

      setSubmitting(false)
    }
  }

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)

  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <Formik
        initialValues={{
          stake: '',
        }}
        validationSchema={Yup.object().shape({
          departmentid: Yup.number().required('Department Id is required'),
          candidatecount: Yup.number().required('Candidate count is required'),
        })}
        onSubmit={async (values, actions) => {
          try {
            const fromAcct = await getFromAcct()
            //   values.countvariable = count
            //   const data = await nearvar.contract. ...
            const opts = [values.departmentid, values.candidatecount]

            // const opts = ['Education', 'Bhadrak', 'whatapp']

            const txExecute = api.tx.election.submitCandidacy(...opts)

            setStatus('Sending...')

            const unsub = await txExecute
              .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
                txResHandler(
                  status,
                  events,
                  dispatchError,
                  actions.setSubmitting
                )
              })
              .catch(txErrHandler)

            setUnsub(() => unsub)

            // history.goBack()
          } catch (e) {
            console.error(e)
            setErrorThrow(e.message)
          }
        }}
      >
        {({
          handleSubmit,
          handleBlur,
          handleChange,
          errors,
          touched,
          isValid,
          isSubmitting,
          values,
          setFieldValue,
          validateForm,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="text-center">
              {status && <p>Status: {status}</p>}
              {errorThrow && <p>error: {errorThrow}</p>}
              <br />
              <div className="form-group">
                <label htmlFor="departmentid">Department Id</label>
                {touched.departmentid && errors.departmentid && (
                  <p className="alert alert-danger">{errors.departmentid}</p>
                )}

                <Field name="departmentid" className="form-control" />
              </div>

              <div className="form-group">
                <label htmlFor="candidatecount">Candidate Count</label>
                {touched.candidatecount && errors.candidatecount && (
                  <p className="alert alert-danger">{errors.candidatecount}</p>
                )}

                <Field name="candidatecount" className="form-control" />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Apply Jurors
              </button>
            </div>
            <SubmittingWheel isSubmitting={isSubmitting} />
            <FocusError />
            <div>{/* <Balance accountPair={accountPair} /> */}</div>
            <br />
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default SubmitCandidacy
