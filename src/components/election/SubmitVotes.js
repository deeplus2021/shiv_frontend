import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Formik, Field, Form } from 'formik'
import CandidatesCheckBox from './CandidatesCheckBox'
import { useParams } from 'react-router-dom'
import ResponsiveAppBar from '../ResponsiveAppBar'
import * as Yup from 'yup'
import Container from '@mui/material/Container'

const sleep = ms => new Promise(r => setTimeout(r, ms))

function SubmitVotes() {
  const [count, setCount] = useState(0)
  const params = useParams()
  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <Container maxWidth="xl">
      <div>
        <h1>Vote</h1>
        <Formik
          initialValues={{
            votes: [],
          }}
          validationSchema={Yup.object().shape({
            votes: Yup.array().max(5, "Vote max 5 candidates"),
          })}
          onSubmit={async values => {
            await sleep(500)
            alert(JSON.stringify(values, null, 2))
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
            <Form>
              <div id="checkbox-group">Candidates</div>
              <div role="group" aria-labelledby="checkbox-group">
                {touched.votes && errors.votes && (
                  <p className="alert alert-danger">{errors.votes}</p>
                )}
                <CandidatesCheckBox dpid={params.dpid} />
              </div>

              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
      </Container>
    </React.Fragment>
  )
}

export default SubmitVotes
