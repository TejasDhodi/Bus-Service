import Header from './Components/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Bookings from './Pages/Bookings'
import BusBook from './Pages/BusBook'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route element={<Home />} path='/'/>
        <Route element={<Bookings />} path='/bookings'/>
        <Route element={<BusBook />} path='/book/:busId'/>
      </Routes>
    </div>
  )
}

export default App
