import { useState, useEffect } from 'react'
import { Container, Card, CardContent, Typography, Box, TextField, Grid, InputAdornment, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { IoSearch } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'
import sap_docs from './../utils/docs/sap_docs.pdf'
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

  const EXAMPLE_1 = 'What is material management?'
  const EXAMPLE_2 = 'How to create purchase order?'
  const EXAMPLE_3 = 'What is Logistic?'
  
  const handleSubmit = (e) => {
    e.preventDefault()

    if (question === '') {
      setAlertMessage('Please give a question!')
      setQuestionError(true)
      return
    }

    setLoading(true)
    const data = {question: question, scenario: scenario }

    axios.post(`${'http://localhost:5000'}/api/sap/qa`, { data: data }).then(response => {
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
              SAP Documentation Question Answering
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Typography variant='subtitle1' sx={{ marginBottom: 4 }}>
                Knowledge Extraction from the SAP Help Portal using OpenAI Large Language Model
              </Typography>
              <Grid container spacing={1} sx={{ marginBottom: 2 }}>
                <Grid item sm={2}>
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
                    <a href={sap_docs} target='_blank'>sap_docs.pdf</a>
                  </Box>
                </Grid>
                <Grid item sm={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='body2' sx={{ textAlign: 'justify' }}>       
                      This Question Answering application utilizes a method called Retrieval Augmented Generation (RAG). This helps the large language model respond to complex questions by using information from SAP Documentation found on the SAP Help Portal. The application provides different prompt examples based on the scenario you choose:
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
                    The source of the document is SAP Help Portal's section on SAP ERP Investment Management. You can generate the PDF of this document by accessing the following link:
                    <a href='https://help.sap.com/docs/SAP_ERP/fbec76de9bca4f0db9c6362a77fdf2f7/2660ba53422bb54ce10000000a174cb4.html?version=6.02.latest&q=material%20management.'>Document Link</a>
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
                            {`${document?.metadata?.source} page ${document?.metadata?.loc?.pageNumber}`}
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