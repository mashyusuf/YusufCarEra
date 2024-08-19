import { AiOutlineHome, AiOutlineLogin, AiOutlineLogout, AiOutlineMenu, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai';
import { FaCar, FaSearch } from 'react-icons/fa'; // Car icon imported from react-icons
import { useState, useEffect, useRef } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import avatarImg from '../../../assets/placeholder.jpg';
import logo from '../../../assets/logo.gif';
import { GiF1Car } from "react-icons/gi";
import './style.css'; // Adjust the path as needed
import useCart from '../../../hooks/useCart';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart]= useCart()
  const navigate = useNavigate();
  

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
    }
  };

  return (
    <div className='fixed w-full bg-rose-100 z-50 shadow-sm'>
      <div className='py-4 border-b-[1px] mx-auto max-w-7xl'>
        <div className='flex items-center justify-between mx-4 lg:mx-auto'>
          {/* Logo */}
          <Link to='/'>
            <img src={logo} alt='logo' width='100' height='100' className='rounded-full' />
          </Link>

          {/* Center content for the navbar */}
          <div className='relative flex-1 flex justify-center'>
            {/* Animated Car Icon */}
            <div className='relative'>
              <GiF1Car className='text-blue-500 text-4xl lg:text-6xl animate-car' />
            </div>
          </div>

          {/* Icons and Dropdown */}
          <div className='flex items-center gap-3'>
            {/* Search Icon */}
            <div
              onClick={() => setSearchModalOpen(true)}
              className='p-3 text-xl cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform transform-gpu'
            >
              <FaSearch />
            </div>

            {/* Shopping Cart Icon */}
<Link to={'/myCart'}><div className='relative p-3 text-xl cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform transform-gpu'>
  <AiOutlineShoppingCart className='text-xl' />
  <span className='absolute -top-0 -right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1'>
    {cart.length}
  </span>
</div></Link>


            {/* Dropdown Menu Button */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className='p-4 border-[1px] border-neutral-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
            >
              <AiOutlineMenu />
              <div>
                {/* Avatar */}
                <img className='rounded-full' referrerPolicy='no-referrer' src={user?.photoURL || avatarImg} alt='profile' height='30' width='30' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div id='search-modal' className='relative bg-white p-4 rounded-lg w-full max-w-md'>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={() => setSearchModalOpen(false)}
              className='absolute top-2 right-2 text-xl cursor-pointer hover:text-red-500'
            >
              &times;
            </button>
            <button
              onClick={handleSearch}
              className='mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition'
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div ref={dropdownRef} className='absolute rounded-xl shadow-md w-[60vw] md:w-[40vw] lg:w-[20vw] bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            <Link to='/' className='block px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2'>
              <AiOutlineHome className='text-blue-500' />
              Home
            </Link>
            <div className='border-t border-gray-200'></div>
            <Link to='/myPurchase' className='block px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2'>
              <FaCar className='text-blue-500' />
              My Purchasing Car
            </Link>
            <Link to='/' className='block px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2'>
              <FaCar className='text-blue-500' />
              You Can Sell Your Car Here!
            </Link>
            <div className='border-t border-gray-200'></div>
            {user ? (
              <div onClick={logOut} className='px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2 cursor-pointer'>
                <AiOutlineLogout className='text-blue-500' />
                Logout
              </div>
            ) : (
              <>
                <Link to='/login' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2'>
                  <AiOutlineLogin className='text-blue-500' />
                  Login
                </Link>
                <Link to='/signUp' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center gap-2'>
                  <AiOutlineUserAdd className='text-blue-500' />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
