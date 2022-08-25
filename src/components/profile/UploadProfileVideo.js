import React, { useCallback, Component, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ipfs from '../../commons/ipfs'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import './UploadProfileVideo.css'
import { CardMedia } from '@mui/material'

function UploadProfileVideo(props) {
  const [ipfspath, setIpfspath] = useState(null)
  const [loading, setLoading] = useState(false)
  async function addData(name, buffer) {
    const file = await ipfs.add({ path: name, content: buffer })
    console.log(name)
    console.log(file.cid.toString())
    setIpfspath(file.cid.toString())
    props.setFieldValue(props.name, file.cid.toString())
    setLoading(false)
  }
  const onDrop = useCallback(async acceptedFile => {
    console.log(acceptedFile)
    setLoading(true)
    let ext = acceptedFile[0].path.split('.').pop().toUpperCase()
    if (ext === 'MP4' || ext === 'MP4') {
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(acceptedFile[0])
      reader.onloadend = () => {
        let buffer = Buffer(reader.result)
        console.log(buffer)
        console.log(buffer)
        //   setBuffer(buffer)
        addData(acceptedFile[0].path, buffer)
      }
    } else {
      props.setFieldTouched(props.name, true)
      console.log('Image must be mp4')
      setLoading(false)
    }
  }, [addData, props])
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  })

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path}- {file.size}
      bytes
    </li>
  ))

  return (
    <Container>
      <Box sx={{ bgcolor: '#cfe8fc', height: '200px' }}>
        <div {...getRootProps({ className: 'jumbotron' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop mp4 video file, or click to select the mp4 video</p>
        </div>
      </Box>
      {files.length > 0 && (
        <React.Fragment>
          <div>
            <h4>Video</h4>
            <ul>{files}</ul>
          </div>
        </React.Fragment>
      )}
      {loading && (
        <React.Fragment>
          <div>
            Please wait while video loads.....
            <br />
            <span className="spinner-border text-danger" role="status">
              <span className="sr-only"></span>
            </span>
          </div>
        </React.Fragment>
      )}
      {ipfspath && (
        <React.Fragment>
          <CardMedia
            component="video"
            controls 
            src={`https://gateway.ipfs.io/ipfs/${ipfspath}`}
          />
        </React.Fragment>
      )}
    </Container>
  )
}

export default UploadProfileVideo
