import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import { FocusError, SubmittingWheel } from './../commons/FocusWheel'
import Container from '@mui/material/Container'
import ResponsiveAppBar from './ResponsiveAppBar'

function AddProfile(props) {
  const { api, currentAccount } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')
  const [unsub, setUnsub] = useState(null)
  const [eventstatus, setEventStatus] = useState()

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0)
  const [formValue, setFormValue] = useState(0)
  const [errorThrow, setErrorThrow] = useState(false)

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

  const txResHandler = (status, events, setSubmitting) => {
    setSubmitting(true)
    if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      setSubmitting(false)
    } else setStatus(`Current transaction status: ${status.type}`)
    setEventStatus('')

    if (status.isInBlock || status.isFinalized) {
      events
        // find/filter for failed events
        .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
        // we know that data for system.ExtrinsicFailed is
        // (DispatchError, DispatchInfo)
        .forEach(
          ({
            event: {
              data: [error, info],
            },
          }) => {
            if (error.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(error.asModule)
              const { documentation, method, section } = decoded

              // console.log(`${section}.${method}: ${documentation.join(' ')}`)
              setEventStatus(method)
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(error.toString())
              setEventStatus(error.toString())
            }
          }
        )
    }
  }

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)

  const signedTx = async () => {
    const fromAcct = await getFromAcct()
    // transformed can be empty parameters
    const opts = []
    const txExecute = api.tx.templateModule.addCitizen(...opts)

    const unsub = await txExecute
      .signAndSend(...fromAcct, txResHandler)
      .catch(txErrHandler)

    setUnsub(() => unsub)
  }

  return (
    <React.Fragment>
      <ResponsiveAppBar/>
      <Container maxWidth="xl">
        <Formik
          initialValues={{
            ipfshash: '',
          }}
          validationSchema={Yup.object().shape({
            ipfshash: Yup.string().required('ipfshash is required'),
          })}
          onSubmit={async (values, actions) => {
            try {
              const fromAcct = await getFromAcct()
              //   values.countvariable = count
              //   const data = await nearvar.contract. ...
              const opts = [values.ipfshash]

              // const opts = ['Education', 'Bhadrak', 'whatapp']

              const txExecute = api.tx.templateModule.addCitizen(...opts)

              setStatus('Sending...')

              const unsub = await txExecute
                .signAndSend(...fromAcct, ({ status, events }) => {
                  txResHandler(status, events, actions.setSubmitting)
                })
                .catch(txErrHandler)

              setUnsub(() => unsub)

              //   await transaction(opts)

              // console.log(data)
              // history.push(`/thankyou${data.mutationoutputname}`)
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
              <p>status: {status}</p>
              <p>eventstatus: {eventstatus}</p>
              {errorThrow && <p>error: {errorThrow}</p>}

              <div className="form-group">
                <label htmlFor="ipfshash">ipfshash</label>
                {touched.ipfshash && errors.ipfshash && (
                  <p className="alert alert-danger">{errors.ipfshash}</p>
                )}

                <Field name="ipfshash" className="form-control" />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Submit Form
                </button>
              </div>
              <SubmittingWheel isSubmitting={isSubmitting} />
              <FocusError />
              <div>{/* <Balance accountPair={accountPair} /> */}</div>
            </Form>
          )}
        </Formik>
      </Container>
    </React.Fragment>
  )
}

export default AddProfile
