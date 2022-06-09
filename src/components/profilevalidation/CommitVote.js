import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { FocusError, SubmittingWheel } from './../../commons/FocusWheel'
import {keccakAsU8a} from "@polkadot/util-crypto"
import CommitEndBlock from '../periodtimeapi/CommitEndBlock'
import PassPeriod from './PassPeriod'

function CommitVote(props) {
  const { api, currentAccount } = useSubstrateState()
  const params = useParams()
  const [count, setCount] = useState(0)
  // The transaction submission status
  const [status, setStatus] = useState(null)
  const [unsubValue, setUnsub] = useState(null)
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

      // navigate('/')

      setSubmitting(false)
    }
  }
  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          validationSchema: '',
        }}
        validationSchema={Yup.object().shape({
            vote: Yup.string()
            .matches(/^[10]+/, "Vote is invalid")
            .required("Vote is required"),
        })}
        onSubmit={async (values, actions) => {
          try {
            const fromAcct = await getFromAcct()
            //   values.countvariable = count

            const hash =  keccakAsU8a(values.vote)
            // Change voteCommit to [u8; 32]
            const opts = [props.id, hash]

            // const opts = ['Education', 'Bhadrak', 'whatapp']

            const txExecute = api.tx.templateModule.commitVote(...opts)

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
              {eventstatus && <p>Error: {eventstatus}</p>}
              {errorThrow && <p>error: {errorThrow}</p>}
              <br />

              <div className="form-group">
                <label htmlFor="vote">Vote</label>
                <p>Vote if already not voted.</p>
                <p>
                  Vote format, first character can be 0 or 1, your choice, then a unique
                  string or salt.
                  <br />1 =&gt; 👍 Evidence are valid <br />
                  0 =&gt; 👎 Evidence are invalid, profile
                  <br />
                  For example, <br />
                  0iilzmfeofopzblgycbuiahhkptp <br />
                  1psiycigusjdkfoartn <br />
                  0lbjvjgzqwigattqdqglzxxdepmwnsf <br />
                </p>
                
                {touched.vote && errors.vote && (
                  <p className="alert alert-danger">{errors.vote}</p>
                )}

                <Field name="vote" className="form-control" />
                <p className="alert alert-warning">
                  Please copy the vote, your choice and salt in an unique place. You will need it to reveal the vote.
                </p>
                <p>Vote: {values.vote}</p>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Commit Vote
              </button>
            </div>
            <SubmittingWheel isSubmitting={isSubmitting} />
            <FocusError />
            <div>{/* <Balance accountPair={accountPair} /> */}</div>
            <br />
          </Form>
        )}
      </Formik>
      <CommitEndBlock id={props.id} />
      <PassPeriod id={props.id} />
    </React.Fragment>
  )
}

export default CommitVote
