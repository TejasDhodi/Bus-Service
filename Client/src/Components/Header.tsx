import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <nav className='navbar'>
      <div className="navBrand"><h2><NavLink to='/'>Bus Booking Service</NavLink></h2></div>
      <ul className="navItems">
        <li className="navLIst"><NavLink to='/'>Home</NavLink></li>
        <li className="navLIst"><NavLink to='/bookings'>Bookings</NavLink></li>
      </ul>
    </nav>
  )
}

export default Header
