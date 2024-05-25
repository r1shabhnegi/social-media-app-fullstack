import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '@/global/toastSlice';
import { AppDispatch } from '@/global/_store';
import { useLoginMutation, useSignUpMutation } from '@/api/queries/authQuery';
import { setCredentials } from '@/global/authSlice';
import { SignupType } from '@rishabhnegi/circlesss-common';
import { Input } from '@/components/ui/input';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>();

  const [SignUp, { isLoading: signUpLoading }] = useSignUpMutation();
  const [login, { isLoading: signInLoading }] = useLoginMutation();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const createUser = await SignUp(formData).unwrap();
      if (!createUser) throw new Error('Sign Up Failed!');

      const signInUser = await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      if (signInUser) {
        navigate('/');
        dispatch(setCredentials({ ...signInUser }));
        dispatch(
          showToast({ message: 'Sign Up Successful!', type: 'SUCCESS' })
        );
      } else {
        throw new Error('Something went wrong maybe try Sign In!');
      }
    } catch (error) {
      dispatch(showToast({ message: error as string, type: 'ERROR' }));
    }
  });

  return (
    <div className='bg-[rgb(26,40,45)] sm:bg-[#0f1a1c] min-h-screen flex justify-center items-center'>
      <form
        className='flex mx-4  flex-col gap-2 sm:gap-3 md:gap-4 max-w-[40rem] w-full px-3 sm:px-6 sm:py-6 rounded-3xl bg-[#1a282d]'
        onSubmit={onSubmit}>
        <h1 className='pb-10 text-3xl text-center font-bold text-[#67787e]'>
          Create Account
        </h1>

        <div className='flex flex-col gap-5 sm:flex-row'>
          <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
            &nbsp;&nbsp;Name
            <Input
              type='text'
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
              {...register('name', {
                required: 'This field is required.',
                minLength: {
                  value: 4,
                  message: 'This field cannot have less than 4 characters.',
                },
                maxLength: {
                  value: 16,
                  message: 'This field cannot have more than 16 characters.',
                },
              })}
            />
            {errors?.name && (
              <p className='text-xs font-semibold text-red-500'>
                &nbsp;&nbsp;{errors?.name.message}
              </p>
            )}
          </label>

          <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
            &nbsp;&nbsp;Username
            <Input
              type='text'
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
              {...register('username', {
                required: 'This field is required.',
                minLength: {
                  value: 4,
                  message: 'This field cannot have less than 4 characters.',
                },
                maxLength: {
                  value: 16,
                  message: 'This field cannot have more than 16 characters.',
                },
              })}
            />
            {errors?.username && (
              <p className='text-xs font-semibold text-red-500'>
                &nbsp;&nbsp;{errors?.username.message}
              </p>
            )}
          </label>
        </div>

        <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
          &nbsp;&nbsp;Email
          <Input
            type='email'
            className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
            {...register('email', {
              required: 'This field is required.',
            })}
          />
          {errors?.email && (
            <p className='text-xs font-semibold text-red-500'>
              &nbsp;&nbsp;{errors?.email.message}
            </p>
          )}
        </label>
        <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
          &nbsp;&nbsp;Password
          <Input
            type='password'
            className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
            {...register('password', {
              required: 'This field is required.',
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)',
              },
            })}
          />
          {errors?.password && (
            <p className='ml-2 text-xs font-semibold text-red-500'>
              {errors?.password.message}
            </p>
          )}
        </label>

        <div>
          <button
            type='submit'
            className=' text-[#f2f2f1]  bg-[#0045ac] w-full h-16 rounded-3xl p-4 outline-none mb-1 font-semibold text-xl mt-5 hover:bg-[#0045acc9] '
            disabled={signInLoading || signUpLoading}>
            Submit
          </button>
          <p className='mt-1 ml-2 text-sm text-[#a0b6bd]'>
            Already have account?
            <Link
              to='/sign-in'
              className='ml-2 font-semibold text-green-400 underline hover:text-green-600'>
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
