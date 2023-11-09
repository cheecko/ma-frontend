import { useState, useEffect } from 'react'
import { Container, Card, CardContent, Typography, Box, TextField, Grid, InputAdornment, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { FaPlus } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'
import { MAX_FILE_UPLOAD_DOCUMENTS, MAX_SIZE_UPLOAD_DOCUMENTS } from '../utils/constants'
import axios from 'axios'
import Header from '../components/Header'
import Toast from '../components/Toast'

const Home = () => {
  const [scenario, setScenario] = useState('2')
  const [question, setQuestion] = useState('')
  const [questionError, setQuestionError] = useState(false)
  const [answer, setAnswer] = useState('')
  const [sourceDocuments, setSourceDocuments] = useState([])
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])

  // example: https://ai.google.com/research/NaturalQuestions/visualization
  const EXAMPLE_1 = 'when are hops added to the brewing process?'
  const EXAMPLE_2 = 'what does the word china mean in chinese?'
  const EXAMPLE_3 = 'who lives in the imperial palace in tokyo?'
  const EXAMPLE_4 = 'where is the world s largest ice sheet located today?'

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'text/plain, application/pdf',
    multiple: false,
    maxFiles: MAX_FILE_UPLOAD_DOCUMENTS,
    maxSize: MAX_SIZE_UPLOAD_DOCUMENTS,
    onDrop: async acceptedFiles => setFiles([...files, ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]),
    onDropRejected: fileRejections => setAlertMessage('Maximal document size is 10MB')
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (question === '') {
      setAlertMessage('Please give a question!')
      setQuestionError(true)
      return
    }

    setLoading(true)

    const headers ={ "Content-Type":"multipart/form-data" }
    const formData = new FormData()
    formData.append('question', question)
    formData.append('scenario', scenario)
    formData.append('file', files[0])
    axios.post(`${'http://localhost:5000'}/api/docs/qa`, formData, { headers: headers }).then(response => {
      console.log(response.data)
      setAnswer(response.data.text)
      setSourceDocuments(response.data.sourceDocuments)
      setLoading(false)
    })
  }

  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value)
  }

  const handleChangeScenario = (e) => {
    setScenario(e.target.value)
  }

  const handleAlertClose = () => {
    setAlertMessage('')
  }

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
        <Card raised sx={{ marginTop: 1, marginBottom: 1}}>
					<CardContent>
            <Typography variant='h4' sx={{ marginBottom: 0.5 }}>
              Documentation Question Answering
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Typography variant='subtitle1' sx={{ marginBottom: 4 }}>
                Knowledge Extraction from the uploaded Document using OpenAI Large Language Model
              </Typography>              
              <Grid container spacing={1} sx={{ marginBottom: 2 }}>
                <Grid item sm={2}>
                  {files.length == 0 ? (
                      <Box {...getRootProps({ sx: {
                        aspectRatio: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px dashed #93919E',
                        borderRadius: 2,
                        backgroundColor: '#FAFAFA',
                        color: '#93919E',
                        outline: 'none',
                        transition: 'border .24s ease -in -out',
                        cursor: 'pointer'
                        } 
                      })}>
                        <input {...getInputProps()} />
                        <FaPlus />
                      </Box>
                    ) : (
                      <Box sx={{
                        aspectRatio: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px dashed #93919E',
                        borderRadius: 2,
                        backgroundColor: '#FAFAFA',
                        color: '#93919E',
                        outline: 'none',
                        transition: 'border .24s ease -in -out',
                        cursor: 'pointer'
                        } }
                      >
                        <a href={files[0]?.preview} target='_blank'>{files[0]?.name}</a>
                      </Box>
                    )}
                </Grid>
                <Grid item sm={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='body2' sx={{ textAlign: 'justify' }}>       
                      This Question Answering application utilizes a method called Retrieval Augmented Generation (RAG). This helps the large language model respond to complex questions by using information from document that you upload on the left. The application provides different prompt examples based on the scenario you choose:
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                      Zero Shot - no prompt example provided
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                      One Shot - one prompt example provided
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                      Few Shot - three prompt examples provided
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                    The main difference between this Question Answering tool and SAP Question Answering is the document you use. With this tool, you have to provide your own document, and the model will answer questions based on the content of that document. The examples in this application can be found in the following link:
                    <a href='https://ai.google.com/research/NaturalQuestions/visualization'>Link</a>
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', marginBottom: 1, gap: 2 }}>
                <ToggleButtonGroup
                  color='primary'
                  value={scenario}
                  exclusive
                  onChange={handleChangeScenario}
                  sx={{ minWidth: 'max-content' }}
                >
                  <ToggleButton value='2'>Few Shot</ToggleButton>
                  <ToggleButton value='1'>One Shot</ToggleButton>
                  <ToggleButton value='0'>Zero Shot</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  color='primary'
                  value={scenario}
                  exclusive
                  onChange={handleChangeQuestion}
                  sx={{ minWidth: 'max-content' }}
                >
                  <ToggleButton value={EXAMPLE_1}>Example 1</ToggleButton>
                  <ToggleButton value={EXAMPLE_2}>Example 2</ToggleButton>
                  <ToggleButton value={EXAMPLE_3}>Example 3</ToggleButton>
                  <ToggleButton value={EXAMPLE_4}>Example 4</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', marginBottom: 2 }}>
                <TextField
                  variant='outlined'
                  fullWidth
                  value={question}
                  onChange={handleChangeQuestion}
                  placeholder='Question'
                  required
                  multiline
                  // size='small'
                  error={question === '' && questionError ? true : false}
                  helperText={question === '' && questionError ? 'Please give a question!' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleSubmit}>
                          <IoSearch />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </form>
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <Card variant='outlined' sx={{ backgroundColor: '#F8F7FF'}}>
                {loading &&
                  <CardContent>
                    <ClipLoader color='#007db8' size={35} />
                  </CardContent>
                }
                {!loading &&
                  <CardContent sx={{ gap: 2 }}>
                    <Typography variant='subtitle1' sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                      Answer:
                    </Typography>
                    <Typography variant='body1' sx={{ marginBottom: 3 }}>
                      {answer}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                      Source Documents:
                    </Typography>
                    {sourceDocuments.map((document, index) => (
                      <Box sx={{ marginBottom: 1, display: 'flex', gap: 2 }} key={index}>
                        <Typography variant='subtitle1'>
                            {index + 1}
                          </Typography>
                          <Box>
                            <Typography variant='subtitle1'>
                              {`${document?.metadata?.source?.replace('blob', files[0]?.name)} page ${document?.metadata?.loc?.pageNumber}`}
                            </Typography>
                            <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                              {document?.pageContent}
                            </Typography>
                          </Box>
                      </Box>
                    ))}
                  </CardContent>
                }
              </Card>
              </Box>
          </CardContent>
				</Card>
        <Toast message={alertMessage} type='error' handleAlertClose={handleAlertClose} />
			</Container>
		</>
	)
}

export default Home