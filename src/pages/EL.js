import { useState, useEffect } from 'react'
import { Container, Card, CardContent, Typography, Box, TextField, Grid, InputAdornment, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { IoSearch } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import Header from '../components/Header'
import Toast from '../components/Toast'

const Home = () => {
  const [scenario, setScenario] = useState('2')
  const [text, setText] = useState('')
  const [textError, setTextError] = useState(false)
  const [entityLinking, setEntityLinking] = useState([])
  const [html, setHTML] = useState('')
  const [disambiguation, setDisambiguation] = useState()
  const [sourceDocuments, setSourceDocuments] = useState([])
  const [minScore, setMinScore] = useState('0.8')
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const EXAMPLE_1 = 'Washington is a first president of United States.'
  const EXAMPLE_2 = 'Elon Musk was born in South Africa. There, he briefly attended classes at the University of Pretoria.'
  const EXAMPLE_3 = 'I am reading a biography of Michael Jordan. He played for the Bulls and the Wizards during his career. In 1992, he led the Dream Team to Olympic gold.'
  const EXAMPLE_4 = 'I am reading a biography of Michael Jordan, the Machine Learning researcher based in Berkeley'

  const createHTML = (data) => {
    const filterSimilarityScore = data.map((linking) => {
      const docs = linking.document[1] > minScore ? linking.document[0] : {}
      return {...linking, document: docs }
    })
    console.log(filterSimilarityScore)

    let html = text
    filterSimilarityScore.forEach(linking => {
      // html = html.replaceAll(linking.entity, linking.document?.metadata?.source ? `<a href="${linking.document?.metadata?.source}" target='_blank'>${linking.entity}</a>` : linking.entity)
      // html = html.split(linking.entity).join(linking.document?.metadata?.source ? `<a href="${linking.document?.metadata?.source}" target='_blank'>${linking.entity}</a>` : linking.entity);
      html = html.replace(new RegExp(linking.entity, 'ig'), linking.document?.metadata?.source ? `<a href="${linking.document?.metadata?.source}" target='_blank'>$&</a>` : '$&')
    });

    return html
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()

    if (text === '') {
      setAlertMessage('Please give a text!')
      setTextError(true)
      return
    }

    setLoading(true)
    const data = { text: text }

    axios.post(`${'http://localhost:5000'}/api/docs/el`, { data: data }).then(response => {
      console.log(response.data)

      setEntityLinking(response.data?.entity_linking)
      setHTML(createHTML(response.data?.entity_linking))
      setDisambiguation(response.data?.disambiguation)
      setSourceDocuments(response.data?.sourceDocuments)
      setLoading(false)
    })
  }

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const handleChangeScenario = (e) => {
    setScenario(e.target.value)
  }

  const handleChangeMinScore = (e) => {
    setMinScore(e.target.value)
  }

  const handleAlertClose = () => {
    setAlertMessage('')
  }
  console.log(createHTML(entityLinking))

  useEffect(() => {
    if(entityLinking.length != 0) setHTML(createHTML(entityLinking))
  }, [minScore])

  console.log(entityLinking)

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
        <Card raised sx={{ marginTop: 1, marginBottom: 1}}>
					<CardContent>
            <Typography variant='h4' sx={{ marginBottom: 0.5 }}>
              Documentation Entity Linking
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Typography variant='subtitle1' sx={{ marginBottom: 4 }}>
                Knowledge Extraction from the uploaded Document using OpenAI Large Language Model
              </Typography>
              <Box sx={{ marginBottom: 4 }}>
                <Typography variant='body2' sx={{ textAlign: 'justify' }}>       
                  This Entity Linking application utilizes a method called Retrieval Augmented Generation (RAG). This helps the large language model respond to complex questions by using information from SAP Glossary found on the SAP Help Portal.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, gap: 2 }}>
                {/* <ToggleButtonGroup
                  color='primary'
                  value={scenario}
                  exclusive
                  onChange={handleChangeScenario}
                  sx={{ minWidth: 'max-content' }}
                >
                  <ToggleButton value='2'>Few Shot</ToggleButton>
                  <ToggleButton value='1'>One Shot</ToggleButton>
                  <ToggleButton value='0'>Zero Shot</ToggleButton>
                </ToggleButtonGroup> */}
                <ToggleButtonGroup
                  color='primary'
                  exclusive
                  onChange={handleChangeText}
                  sx={{ minWidth: 'max-content' }}
                >
                  <ToggleButton value={EXAMPLE_1}>Example 1</ToggleButton>
                  <ToggleButton value={EXAMPLE_2}>Example 2</ToggleButton>
                  <ToggleButton value={EXAMPLE_3}>Example 3</ToggleButton>
                  <ToggleButton value={EXAMPLE_4}>Example 4</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  color='primary'
                  value={minScore}
                  exclusive
                  onChange={handleChangeMinScore}
                  sx={{ minWidth: 'max-content' }}
                >
                  <ToggleButton value='0.7'>0.7</ToggleButton>
                  <ToggleButton value='0.75'>0.75</ToggleButton>
                  <ToggleButton value='0.8'>0.8</ToggleButton>
                  <ToggleButton value='0.85'>0.85</ToggleButton>
                  <ToggleButton value='0.9'>0.9</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', marginBottom: 2 }}>
                <TextField
                  variant='outlined'
                  fullWidth
                  value={text}
                  onChange={handleChangeText}
                  placeholder='Text'
                  required
                  multiline
                  // size='small'
                  error={text === '' && textError ? true : false}
                  helperText={text === '' && textError ? 'Please give a text!' : ''}
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
                      HTML:
                    </Typography>
                    <Typography variant='body1' sx={{ marginBottom: 3 }} dangerouslySetInnerHTML={{__html: html}}></Typography>
                    {/* <Typography variant='body1' sx={{ marginBottom: 3 }}>{html}</Typography> */}
                    <Typography variant='subtitle1' sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                      JSON:
                    </Typography>
                    <Box sx={{ marginBottom: 3 }}>
                      {entityLinking.map((linking, index) => (
                        <Box sx={{ marginBottom: 1, display: 'flex', gap: 2 }} key={index}>
                          <Typography variant='subtitle1'>
                            {index + 1}
                          </Typography>
                          <Box>
                            <Typography variant='subtitle1'>
                              {linking.entity}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                                In Context:
                              </Typography>
                              <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                                {disambiguation?.[linking.entity]}
                                </Typography>
                              {/* <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                                - Document search by:
                              </Typography>
                              <Typography variant='body2' sx={{ fontWeight: 'bold', color: disambiguation?.[linking.entity] === linking.document[0]?.metadata?.search ? 'black': 'red' }}>
                                {linking.document[0]?.metadata?.search}
                              </Typography> */}
                            </Box>
                            <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                              <a href={linking.document[0]?.metadata?.source} target='_blank'>{linking.document[0]?.metadata?.source}</a>
                              {` (${linking.document[1]})`}
                            </Typography>
                            <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                              <a href={`https://en.wikipedia.org/?curid=${linking.document[0]?.metadata?.pageId}`} target='_blank'>({linking.document[0]?.metadata?.pageId})</a>
                              ({linking.document[0]?.metadata?.pageId})
                              {` ${linking.document[0]?.pageContent}`}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Typography variant='subtitle1' sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                      Source Documents:
                    </Typography>
                    <Box sx={{ marginBottom: 3 }}>
                      {sourceDocuments.map((document, index) => (
                        <Box sx={{ marginBottom: 1, display: 'flex', gap: 2 }} key={index}>
                          <Typography variant='subtitle1'>
                            {index + 1}
                          </Typography>
                          <Box>
                            <Typography variant='subtitle1'>
                              <a href={document?.metadata?.source} target='_blank'>{document?.metadata?.source}</a>
                              {` search: ${document?.metadata?.search}`}
                            </Typography>
                            <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                              <a href={`https://en.wikipedia.org/?curid=${document?.metadata?.pageId}`} target='_blank'>({document?.metadata?.pageId})</a>
                              {` ${document?.pageContent}`}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
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