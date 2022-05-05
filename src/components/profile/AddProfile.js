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
import UploadProfileVideo from './UploadProfileVideo'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import "./AddProfile.css"

function AddProfile(props) {
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
        setSubmitting(false)
      } else {
        console.log(dispatchError.toString())
      }
    } else if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      console.log('eventstatus', eventstatus)

      navigate('/profile')

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
            name: '',
            details: '',
            video: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('name is required'),
            details: Yup.string().required('Details is required'),
            video: Yup.string().required('Video is required'),
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
              const opts = [file.cid.toString()]

              // const opts = ['Education', 'Bhadrak', 'whatapp']

              const txExecute = api.tx.templateModule.addCitizen(...opts)

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
                <label htmlFor="name">Name</label>
                {touched.name && errors.name && (
                  <p className="alert alert-danger">{errors.name}</p>
                )}

                <Field name="name" className="form-control" />
              </div>

              <div className="form-group">
                <label htmlFor="details">Details</label>
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
              <div className="form-group">
                <label htmlFor="Video">Video</label>
                {touched.video && errors.video && (
                  <p className="alert alert-danger">{errors.video}</p>
                )}
                <UploadProfileVideo
                  name={'video'}
                  setFieldValue={setFieldValue}
                />
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
