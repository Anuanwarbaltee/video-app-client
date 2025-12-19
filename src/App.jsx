import './App.css'
import { CustomStyle } from './Shell/CustomStyles';
import Router from './Shell/Router'
import GlobalStyles from '@mui/material/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles styles={CustomStyle} />
      <Router />

    </>
  )
}
export default App
