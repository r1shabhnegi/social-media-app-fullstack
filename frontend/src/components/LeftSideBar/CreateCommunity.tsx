import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MdOutlineCancel } from 'react-icons/md';
import { useCreateCommunityMutation } from '@/api/queries/community';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/global/toastSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/global/_store';

type CreateCommunityTypes = {
  name: string;
  description: string;
};

const CreateCommunity = ({ cancelBtn }: { cancelBtn: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm<CreateCommunityTypes>();

  const [CreateCommunity, { isSuccess, error }] = useCreateCommunityMutation();

  const onSubmit = handleSubmit(async (formData: CreateCommunityTypes) => {
    await CreateCommunity(formData);
    if (isSuccess) {
      // reset();
      navigate(`/community/${formData.name}`);
      console.log('success');
    }
    console.log(isSuccess);
    // console.log(isError);
    if (!isSuccess) {
      // dispatch(showToast({ message: error.data, type: 'ERROR' }));
      console.log(error);
    }
  });

  return (
    <div className='fixed top-0 left-0 z-10 flex items-center justify-center w-full h-screen bg-black bg-opacity-30'>
      <form
        className='bg-[#0f1a1c] w-[35rem] p-6 rounded-3xl gap-2 flex flex-col'
        onSubmit={onSubmit}>
        <span className='flex items-end justify-between mb-3'>
          <h1 className='text-3xl '>Create a community</h1>
          <MdOutlineCancel
            className='cursor-pointer size-7'
            onClick={cancelBtn}
          />
        </span>
        <p className='text-[#99a5a9] text-sm mb-3'>
          Build and grow a community about something you care about. We'll help
          you set things up.
        </p>

        <div className='flex flex-col gap-5 mt-3 mb-6'>
          <label className='flex flex-col text-[#67787e] text-sm'>
            &nbsp;&nbsp;Name
            <Input
              {...register('name', {
                required: 'This field is required',
              })}
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='Name should be unique.'
            />
            <p className='mt-2 text-red-600'>{errors?.name?.message}</p>
          </label>

          <label className='flex flex-col text-[#67787e] text-sm'>
            &nbsp;&nbsp;Description
            <Textarea
              {...register('description', {
                required: 'This field is required',
              })}
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='Add a description about the community.'
            />
            <p className='mt-2 text-red-600'>{errors?.description?.message}</p>
          </label>
        </div>
        <div className='flex justify-end gap-5 mt-3'>
          <button
            className='px-5 py-3 bg-[#223237] rounded-2xl'
            type='button'
            onClick={cancelBtn}>
            Cancel
          </button>
          <button className='px-5 py-3 bg-[#0045ac] rounded-2xl'>Create</button>
        </div>
      </form>
    </div>
  );
};
export default CreateCommunity;
