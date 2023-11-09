import { createContext, useReducer } from 'react'
import {  } from './../utils/constants'

const GlobalContext = createContext()

const GlobalReducer = (state, action) => {
	switch (action.type) {
		case 'getStudyProgram': {
			return {...state}
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`)
		}
}
}

const GlobalContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(GlobalReducer, {})
  
	return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>
}

export { GlobalContext, GlobalContextProvider }