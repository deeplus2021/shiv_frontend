import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import ipfs from '../../commons/ipfs'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { FocusError, SubmittingWheel } from './../../commons/FocusWheel'
import Container from '@mui/material/Container'
import ResponsiveAppBar from './../ResponsiveAppBar'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import "./AddProfile.css"

function ChallengeEvidenceComment(props) {
  const { api, currentAccount } = useSubstrateState()

  let modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  let formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]

  // The transaction submission status
  const [status, setStatus] = useState(null)
  const [unsubValue, setUnsub] = useState(null)
  const [eventstatus, setEventStatus] = useState(null)

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0)
  const [formValue, setFormValue] = useState(0)
  const [errorThrow, setErrorThrow] = useState(false)
  let navigate = useNavigate()
  const params = useParams()

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
      if (dispatchError.isModule) {
        // for module errors, we have the section indexed, lookup
        const decoded = api.registry.findMetaError(dispatchError.asModule)
        const { docs, name, section } = decoded

        console.log(`${section}.${name}: ${docs.join(' ')}`)
        setEventStatus(name)
        setStatus(null)
        setSubmitting(false)
      } else {
        console.log(dispatchError.toString())
      }
    } else if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      console.log('eventstatus', eventstatus)

    //   navigate('/profile')

      setSubmitting(false)
    }
  }

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)

  // const signedTx = async () => {
  //   const fromAcct = await getFromAcct()
  //   // transformed can be empty parameters
  //   const opts = []
  //   const txExecute = api.tx.templateModule.addCitizen(...opts)

  //   const unsub = await txExecute
  //     .signAndSend(...fromAcct, txResHandler)
  //     .catch(txErrHandler)

  //   setUnsub(() => unsub)

  // }

  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <Container maxWidth="xl">
        <Formik
          initialValues={{
            details: '',
          }}
          validationSchema={Yup.object().shape({
            details: Yup.string().required('Details is required'),
          })}
          onSubmit={async (values, actions) => {
            try {
              const file = await ipfs.add({
                path: 'profile.json',
                content: JSON.stringify(values),
              })
              const fromAcct = await getFromAcct()
              //   values.countvariable = count
              //   const data = await nearvar.contract. ...
              const opts = [params.id, file.cid.toString()]

              // const opts = ['Education', 'Bhadrak', 'whatapp']

              const txExecute = api.tx.templateModule.challengeCommentCreate(...opts)

              setStatus('Sending...')

              const unsub = await txExecute
                .signAndSend(
                  ...fromAcct,
                  ({ status, events, dispatchError }) => {
                    txResHandler(
                      status,
                      events,
                      dispatchError,
                      actions.setSubmitting
                    )
                  }
                )
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
              {status && <p>Status: {status}</p>}
              {eventstatus && <p>Error: {eventstatus}</p>}
              {errorThrow && <p>error: {errorThrow}</p>}

             

              <div className="form-group">
                <label htmlFor="details">Evidence</label>
                {touched.details && errors.details && (
                  <p className="alert alert-danger">{errors.details}</p>
                )}

                <Field id="details" name="details" className="form-control details">
                  {({ field }) => (
                    <ReactQuill
                      value={field.value}
                      onChange={field.onChange(field.name)}
                      modules={modules}
                      formats={formats}
                      // modules={CreateProduct.modules}
                    />
                  )}
                </Field>
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

export default ChallengeEvidenceComment
