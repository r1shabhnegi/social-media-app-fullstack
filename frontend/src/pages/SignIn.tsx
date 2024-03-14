import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as ApiClient from '../ApiClient';
import { useDispatch } from 'react-redux';
import { showToast } from '@/global/toastSlice';
import { AppDispatch } from '@/global/store';
import { authValidation } from '@/global/authSlice';

export type SignInTypes = {
  username: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<SignInTypes>();

  const mutation = useMutation({
    mutationFn: ApiClient.signIn,
    onSuccess: async () => {
      dispatch(
        showToast({ message: 'Sign In Successfully!', type: 'SUCCESS' })
      );
      dispatch(authValidation());
      navigate('/');
    },
    onError: () => {
      dispatch(showToast({ message: 'Something Went Wrong!', type: 'ERROR' }));
    },
  });

  const onSubmit = handleSubmit((formData) => {
    mutation.mutate(formData);
  });

  return (
    <div className='container px-16 py-20 sm:px-28 md:px-40 lg:px-56 xl:px-80'>
      <form
        className='flex flex-col gap-5'
        onSubmit={onSubmit}>
        <h1 className='pb-10 text-3xl font-semibold text-gray-600'>
          Login user
        </h1>

        <label className='flex flex-col text-sm text-gray-700 md:text-md'>
          Username
          <input
            type='username'
            className='h-8 p-2 bg-gray-100 border-2 border-gray-300 rounded-lg md:h-10 focus:outline-none focus:border-gray-500'
            {...register('username', {
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
              validate: (val) => {
                if (val.length < 8) {
                  return 'Password should be have 8 characters or more.';
                } else if (val === '') {
                  return 'This field is required';
                }
              },
            })}
          />
        </label>

        <div>
          <button
            type='submit'
            className='flex items-center justify-center w-full h-8 p-2 mt-6 font-semibold text-gray-700 bg-gray-300 rounded-lg md:h-10 hover:bg-gray-400'>
            Submit
          </button>
          <p className='mt-1 text-md md:text-base'>
            Create an Account
            <span className='ml-1 font-semibold text-gray-700 underline hover:text-green-500'>
              <Link to='/register'>Sign Up</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
