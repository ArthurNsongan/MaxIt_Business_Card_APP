import Splashscreen from './components/splashscreen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import AppBar from './components/appbar'
import EditCard from './pages/EditCard'
import { useEffect, useState } from 'react'
// import { pageInAnimation } from './utils/animations';
import { AppBarProvider } from './contexts/appbar_context'
import { UserContextProvider } from './contexts/user_context'


function App() {

  const [played, setPlayed] = useState(false)
  
  useEffect(() => {
    if(!played) {
      // pageInAnimation();
      setPlayed(true);
    }
  }, [played])
  

  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <AppBarProvider>
            <AppBar/>
            <div className="bg-white relative rounded-md w-full flex flex-col items-center justify-center">
                <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/' element={<Home />} />
                  <Route path='/edit' element={<EditCard />} />
                </Routes>
            </div>
          </AppBarProvider>          
        </BrowserRouter>
      </UserContextProvider>
      {/* <Splashscreen /> */}
    </>
  )
}

export default App
