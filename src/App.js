import React, { createRef, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
import AddProfile from './components/profile/AddProfile'
import UploadProfileVideo from './components/profile/UploadProfileVideo'
import ProfileData from './components/profile/ProfileData'
import { SubContext } from './commons/context/SubContext'
import ProfileById from './components/profile/ProfileById'
import PeriodName from './components/profile/PeriodName'
import ChallengerEvidence from './components/profile/ChallengerEvidence'
import ChallengeEvidenceComment from './components/profile/ChallengeEvidenceComment'
import ChallengeEvidenceView from './components/profile/ChallengeEvidenceView'
import ChallengeEvidenceGet from './components/profile/ChallengeEvidenceGet'

function Main() {
  const [userId, setUserId] = useState(null)
  const { apiState, apiError, keyringState, api, currentAccount } =
    useSubstrateState()
  const queryResHandler = result => {
    result.isNone ? setUserId(null) : setUserId(result.toString())
    console.log('result,', result.toString())
  }
  useEffect(() => {
    async function myfn() {
      const opts = [currentAccount.address]
      console.log('currentaccount', currentAccount.address)
      let data = api.query.templateModule.citizenId(...opts, queryResHandler)
      console.log(data)
    }

    myfn()
  }, [currentAccount, api])

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  return (
    <SubContext.Provider value={{ userId }}>
      <Routes>
        <Route path="/" element={<SubstrateTemplate />} />
        <Route path="/addprofile" element={<AddProfile />} />
        <Route path="/uploadvideo" element={<UploadProfileVideo />} />
        <Route path="/profile" element={<ProfileData />} />
        <Route path="/profile/:id" element={<ProfileById />} />
        <Route
          path="/evidenceforchallenge/:id"
          element={<ChallengerEvidence />}
        />
        <Route path="/comment/:id" element={<ChallengeEvidenceComment />} />
        <Route path="/challengeevidence/:id" element={<ChallengeEvidenceView />} />
      </Routes>
    </SubContext.Provider>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}

function SubstrateTemplate() {
  const contextRef = createRef()
  return (
    <React.Fragment>
      <div ref={contextRef}>
        <Sticky context={contextRef}>
          <AccountSelector />
        </Sticky>
        <Container>
          <Grid stackable columns="equal">
            <Grid.Row stretched>
              <NodeInfo />
              <Metadata />
              <BlockNumber />
              <BlockNumber finalized />
            </Grid.Row>
            <Grid.Row stretched>
              <Balances />
            </Grid.Row>
            <Grid.Row>
              <Transfer />
              <Upgrade />
            </Grid.Row>
            <Grid.Row>
              <Interactor />
              <Events />
            </Grid.Row>
            <Grid.Row>
              <TemplateModule />
            </Grid.Row>
          </Grid>
        </Container>
        <DeveloperConsole />
      </div>
    </React.Fragment>
  )
}
