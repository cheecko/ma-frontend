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
  const [minScore, setMinScore] = useState('0.8')
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const EXAMPLE_1 = 'Choose Logistics  Materials Management  Purchasing  Purchase Order  Create  Vendor/Supplying Plant Known. Enter the vendor and the purchasing group on the Org. data tab page.'
  const EXAMPLE_2 = 'In order to create a purchase order related to a purchase requisition, you first have to display the document overview. Select the corresponding purchase requisition by choosing the Selection variant pushbutton, and then choosing Purchase requisition.  '
  const EXAMPLE_3 = 'Select the purchase requisition and place it in your shopping cart using drag and drop.'

  const createHTML = (data) => {
    const filterSimilarityScore = data.map((linking) => {
      const docs = linking.document[1] > minScore ? linking.document[0] : {}
      return {...linking, document: docs }
    })
    console.log(filterSimilarityScore)

    let html = text
    filterSimilarityScore.forEach(linking => {
      html = html.replaceAll(linking.entity, linking.document?.metadata?.url ? `<a href="${linking.document?.metadata?.url}" target='_blank'>${linking.entity}</a>` : linking.entity)
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

    axios.post(`${'http://localhost:5000'}/api/sap/el`, { data: data }).then(response => {
      console.log(response.data)

      setEntityLinking(response.data?.entity_linking)
      setHTML(createHTML(response.data?.entity_linking))
      setDisambiguation(response.data?.disambiguation)
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
              SAP Documentation Entity Linking
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Typography variant='subtitle1' sx={{ marginBottom: 4 }}>
                Knowledge Extraction from the uploaded Document using OpenAI Large Language Model
              </Typography>
              <Box sx={{ marginBottom: 4 }}>
                <Typography variant='body2' sx={{ textAlign: 'justify' }}>       
                  This Entity Linking application utilizes a method called Retrieval Augmented Generation (RAG). This helps the large language model respond to complex questions by using information from SAP Glossary found on the SAP Help Portal.
                </Typography>
                <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                  The source of the document is SAP Help Portal's section on SAP Glossary. You can generate the PDF of this document by accessing the following link:
                  <a href='https://help.sap.com/glossary/'>Document Link</a>
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
                            <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                              - Source:
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                              {linking.document[0]?.metadata?.source}
                            </Typography>
                          </Box>
                          
                          <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                            <a href={linking.document[0]?.metadata?.url} target='_blank'>{linking.document[0]?.metadata?.term}</a>
                            {` (${linking.document[1]})`}
                          </Typography>
                          <Typography variant='body2' sx={{ textAlign: 'justify' }}>
                            {linking.document[0]?.pageContent}
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