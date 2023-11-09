import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalContextProvider } from './contexts/GlobalContext'
import SAPQA from './pages/SAPQA'
import QA from './pages/QA'
import SAPEL from './pages/SAPEL'
import EL from './pages/EL'

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={SAPQA} exact />
          <Route path='/sap-qa' Component={SAPQA} exact />
          <Route path='/qa' Component={QA} exact />
          <Route path='/sap-el' Component={SAPEL} exact />
          <Route path='/el' Component={EL} exact />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App
