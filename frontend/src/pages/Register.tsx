import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as ApiClient from '../ApiClient';
import { useDispatch } from 'react-redux';
import { showToast } from '@/global/toastSlice';
import { AppDispatch } from '@/global/store';

export type RegisterTypes = {
  name: string;
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<RegisterTypes>();

  const mutation = useMutation({
    mutationFn: ApiClient.register,
    onSuccess: async () => {
      dispatch(
        showToast({ message: 'Registered Successfully!', type: 'SUCCESS' })
      );
      await queryClient.invalidateQueries({ queryKey: ['validation-token'] });
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
          Register User
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
          <p className='mt-1 text-sm md:text-md'>
            Already Registered?
            <span className='ml-1 font-semibold text-gray-700 underline hover:text-green-500'>
              <Link to='/sign-in'>Sign In</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Register;
