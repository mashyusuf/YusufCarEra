import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { SiSecurityscorecard } from "react-icons/si"; // Import sports car icon for spinner
import { useState } from 'react';
import logo from '../../assets/logo.gif'; // Import your logo here
import image from '../../assets/login.gif'; // Background image

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.form?.pathname || '/';
  console.log('state is okey',location.state)
  const { signInWithGoogle, signIn, loading, setLoading, resetPassword } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      await signIn(email, password);
      navigate(from);
      toast.success('Login Successful');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.error('Please write your email first!');
    try {
      await resetPassword(email);
      toast.success('Request Successful! Check your email for further process...');
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from);
      toast.success('Login Successful');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div
      className='flex justify-center items-center min-h-screen bg-cover bg-center'
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className='flex flex-col mt-5 mb-5 max-w-lg w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-90 text-gray-900'>
        <div className='mb-8 text-center'>
          <img src={logo} alt='Logo' className='w-32 rounded-full mx-auto mb-6' /> {/* Centered Logo */}
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Welcome Back, Yusuf!</h1>
          <p className='text-lg text-gray-600'>
            Ready to continue where you left off? Log in to access your account and explore our car collection!
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                onBlur={(e) => setEmail(e.target.value)}
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-4 py-3 border rounded-md border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                name='password'
                autoComplete='current-password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-4 py-3 border rounded-md border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type='submit'
              className='bg-blue-500 w-full rounded-md py-3 text-white font-semibold hover:bg-blue-600 transition-all'
            >
              {loading ? (
                <SiSecurityscorecard className='animate-spin m-auto text-xl' /> // Sports car spinner
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
        <div className='space-y-1 mt-4'>
          <button
            onClick={handleResetPassword}
            className='text-xs hover:underline hover:text-blue-500 text-gray-500'
          >
            Forgot password?
          </button>
        </div>
        <div className='flex items-center pt-6 space-x-1'>
          <div className='flex-1 h-px bg-gray-300'></div>
          <p className='px-3 text-sm text-gray-500'>
            Or login with
          </p>
          <div className='flex-1 h-px bg-gray-300'></div>
        </div>

        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className='disabled:cursor-not-allowed flex justify-center items-center space-x-3 border border-gray-300 rounded-md bg-gray-100 p-3 hover:bg-gray-200 transition-all'
        >
          <FcGoogle size={28} />
          <p className='text-sm font-medium text-gray-600'>Continue with Google</p>
        </button>

        <p className='text-sm text-center text-gray-500 mt-6'>
          Don&apos;t have an account yet?{' '}
          <Link
            to='/signUp'
            className='text-blue-600 hover:underline font-medium'
          >
            Sign up
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
