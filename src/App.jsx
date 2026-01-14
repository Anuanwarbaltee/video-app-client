import './App.css'
import { CustomStyle } from './Shell/CustomStyles';
import Router from './Shell/Router'
import GlobalStyles from '@mui/material/GlobalStyles';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <GlobalStyles styles={CustomStyle} />
      <Router />
      <Analytics />
    </>
  )
}
export default App
