import React, { useState } from 'react'
import Pagination from '@mui/material/Pagination'
import Grid from '@mui/material/Grid'

function AppPagination({ setPage, pageCount }) {
  const handleChange = (event, value) => {
    setPage(value)
  }
  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Pagination count={pageCount} color="primary" onChange={handleChange} />
      </Grid>
    </React.Fragment>
  )
}

export default AppPagination
