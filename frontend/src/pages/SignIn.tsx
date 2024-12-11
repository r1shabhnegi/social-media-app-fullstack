import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/queries/authQuery";
import { showToast } from "@/global/toastSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/global/_store";
import { setCredentials } from "@/global/authSlice";
import { signinType } from "@rishabhnegi/circlesss-common";
import { Input } from "@/components/ui/input";
import MoonLoader from "react-spinners/MoonLoader";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinType>();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const signInUser = await login(formData).unwrap();
      if (signInUser) {
        dispatch(setCredentials({ ...signInUser }));
        dispatch(
          showToast({ message: "Sign In Successful!", type: "SUCCESS" })
        );
        navigate("/");
      }
    } catch (error) {
      dispatch(showToast({ message: "Sign In Failed!", type: "ERROR" }));
    }
  });

  return (
    <div className='bg-[rgb(26,40,45)] sm:bg-[#0f1a1c] min-h-screen flex justify-center items-center'>
      <form
        className='flex mx-4  flex-col gap-2 sm:gap-3 md:gap-4 max-w-[40rem] w-full px-3 sm:px-6 sm:py-6 rounded-3xl bg-[#1a282d]'
        onSubmit={onSubmit}>
        <h1 className='pb-10 text-3xl text-center font-bold text-[#67787e]'>
          Sign In User
        </h1>

        <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
          &nbsp;&nbsp;Username
          <Input
            type='text'
            className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
            {...register("username", {
              required: "This field is required.",
              minLength: {
                value: 4,
                message: "This field cannot have less than 4 characters.",
              },
              maxLength: {
                value: 16,
                message: "This field cannot have more than 16 characters.",
              },
            })}
          />
          {errors?.username && (
            <p className='text-xs font-semibold text-red-500'>
              &nbsp;&nbsp;{errors?.username.message}
            </p>
          )}
        </label>
        <label className='flex flex-1 flex-col text-[#67787e] font-semibold text-sm'>
          &nbsp;&nbsp;Password
          <Input
            type='password'
            className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none mb-1'
            {...register("password", {
              required: "This field is required.",
            })}
          />
          {errors?.password && (
            <p className='ml-2 text-xs font-semibold text-red-500'>
              {errors?.password.message}
            </p>
          )}
        </label>

        <button
          type='submit'
          disabled={isLoading}
          className=' text-[#f2f2f1]  bg-[#0045ac] w-full h-16 rounded-3xl p-4 outline-none mb-1 font-semibold text-xl mt-5 hover:bg-[#0045acc9] '>
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <MoonLoader
                color='#f2f2f1'
                loading={true}
                size={30}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </div>
          ) : (
            "Submit"
          )}
        </button>
        {/* <div> */}
        <p className='mt-1 ml-2 text-sm text-[#a0b6bd]'>
          Create an Account
          <Link
            to='/sign-up'
            className='ml-2 font-semibold text-green-400 underline hover:text-green-600'>
            Sign Up
          </Link>
        </p>
        {/* </div> */}
      </form>
    </div>
  );
};

export default SignIn;
