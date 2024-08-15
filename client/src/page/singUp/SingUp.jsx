import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaCarSide } from 'react-icons/fa'; // Example sports car icon
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { imageUpload } from '../../api/utils/index';
import signupBg from '../../assets/signup.gif'; // Background Image
import logo from '../../assets/logo.gif'; // Logo Image
import { GiCarpetBombing } from "react-icons/gi";
const SignUp = () => {
  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile, loading, setLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    try {
      setLoading(true);
      // 1. Upload image and get image url
      const image_url = await imageUpload(image);
      console.log(image_url);
      // 2. User Registration
      const result = await createUser(email, password);
      console.log(result);

      // 3. Save username, photo, and role in firebase
      await updateUserProfile(name, image_url);
      navigate('/');
      toast.success('Signup Successful');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // handle google signin
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
      toast.success('Signup Successful');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: `url(${signupBg})` }}
    >
      <div className='flex flex-col mt-5 mb-5 max-w-lg w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-80 text-gray-900'>
        <img
          src={logo}
          alt='Logo'
          className='w-32 h-32 mx-auto mb-6 rounded-full' // Center the logo
        />
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Create Account</h1>
          <p className='text-gray-600 mt-2 text-lg'>Join us and explore the best Cars!</p>
        </div>
        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div>
            <label htmlFor='name' className='block mb-2 text-lg font-semibold text-gray-700'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Enter Your Name Here'
              className='w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-300'
            />
          </div>
          <div>
            <label htmlFor='email' className='block mb-2 text-lg font-semibold text-gray-700'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              required
              placeholder='Enter Your Email Here'
              className='w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-300'
            />
          </div>
          <div>
            <label htmlFor='password' className='block mb-2 text-lg font-semibold text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              required
              placeholder='*******'
              className='w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-300'
            />
          </div>
          <div>
            <label htmlFor='image' className='block mb-2 text-lg font-semibold text-gray-700'>
              Profile Image
            </label>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              required
              className='w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-300'
            />
          </div>
          <div>
            <button
              disabled={loading}
              type='submit'
              className='w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all'
            > 
              {loading ? (
                <div className='flex items-center justify-center'>
                  <FaCarSide className='animate-spin text-blue-700' size={24} />
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
        <div className='flex items-center justify-center mt-6'>
          <div className='w-1/3 h-px bg-gray-300'></div>
          <p className='text-sm text-gray-600 mx-2'>or</p>
          <div className='w-1/3 h-px bg-gray-300'></div>
        </div>
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className='mt-4 w-full py-3 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition-all'
        >
          <FcGoogle size={24} />
          <span className='ml-2 text-lg font-semibold'>Continue with Google</span>
        </button>
        <p className='text-sm text-gray-600 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
