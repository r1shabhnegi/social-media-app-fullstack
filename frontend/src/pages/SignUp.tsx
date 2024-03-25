import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '@/global/toastSlice';
import { AppDispatch } from '@/global/_store';
import { useSignUpMutation } from '@/api/queries/authQuery';
import { useEffect } from 'react';

export type SignUpTypes = {
  name: string;
  username: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<SignUpTypes>();
  const [SignUp, { isSuccess }] = useSignUpMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(showToast({ message: 'Sign Up Successful!', type: 'SUCCESS' }));
    }
  }, [isSuccess, dispatch]);

  const onSubmit = handleSubmit((formData: SignUpTypes) => {
    SignUp(formData);
  });

  return (
    <div className='container px-16 py-20 sm:px-28 md:px-40 lg:px-56 xl:px-80'>
      <form
        className='flex flex-col gap-5'
        onSubmit={onSubmit}>
        <h1 className='pb-10 text-3xl font-semibold text-gray-600'>
          Sign Up User
        </h1>

        <div className='flex flex-col gap-5 md:flex-row'>
          <label className='flex flex-col flex-1 text-sm text-gray-700 md:text-md'>
            Name
            <input
              type='text'
              className='h-8 p-2 bg-gray-100 border-2 border-gray-300 rounded-lg md:h-10 focus:outline-none focus:border-gray-500'
              {...register('name', {
                required: 'This field is required',
              })}
            />
          </label>

          <label className='flex flex-col flex-1 text-sm text-gray-700 md:text-md'>
            Username
            <input
              type='text'
              className='h-8 p-2 bg-gray-100 border-2 border-gray-300 rounded-lg md:h-10 focus:outline-none focus:border-gray-500'
              {...register('username', {
                required: 'This field is required',
              })}
            />
          </label>
        </div>

        <label className='flex flex-col text-sm text-gray-700 md:text-md'>
          Email
          <input
            type='email'
            className='h-8 p-2 bg-gray-100 border-2 border-gray-300 rounded-lg md:h-10 focus:outline-none focus:border-gray-500'
            {...register('email', {
              required: 'This field is required',
            })}
          />
        </label>
        <label className='flex flex-col text-sm text-gray-700 md:text-md'>
          Password
          <input
            type='password'
            className='h-8 p-2 bg-gray-100 border-2 border-gray-300 rounded-lg md:h-10 focus:outline-none focus:border-gray-500'
            {...register('password', {
              required: 'This field is required',
            })}
          />
        </label>

        <div>
          <button
            type='submit'
            className='flex items-center justify-center w-full h-8 p-2 mt-6 font-semibold text-gray-700 bg-gray-300 rounded-lg md:h-10 hover:bg-gray-400'>
            Submit
          </button>
          <p className='mt-1 text-sm md:text-base'>
            Already Signed Up?
            <span className='ml-1 font-semibold text-gray-700 underline hover:text-green-500'>
              <Link to='/sign-in'>Sign In</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
