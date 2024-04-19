import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { useEffect, useState } from 'react';
import { useCreatePostMutation } from '@/api/queries/postQuery';
import Loading from '../Loading';
import { showToast } from '@/global/toastSlice';

type PostTypes = {
  title: string;
  content: string;
  image: string;
};

const CreatePost = ({
  selectedCommunity,
}: {
  selectedCommunity: {
    communityName: string;
  };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectOption, setSelectOption] = useState<string>('');
  const [disableSelect, setDisableSelect] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<PostTypes>();

  const { userCommunitiesList, modCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  useEffect(() => {
    if (selectedCommunity) {
      setSelectOption(selectedCommunity.communityName);
      setDisableSelect(true);
    }
  }, [disableSelect, selectedCommunity]);

  useEffect(() => {
    if (selectedCommunity === null) setSelectOption('Choose a community');
  }, []);

  const [createPost, { isLoading }] = useCreatePostMutation();
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('communityName', selectOption);
    formData.append('image', data.image[0]);
    try {
      const res = await createPost(formData).unwrap();
      console.log(res);
      if (res) {
        dispatch(
          showToast({ message: 'Post Created Successfully!', type: 'SUCCESS' })
        );
      }
      navigate(`/community/${selectOption}`);
    } catch (error) {
      dispatch(showToast({ message: 'Error creating Post!', type: 'ERROR' }));
    }
  });

  return (
    <div className='w-[45rem] mr-5 '>
      <h1 className='px-1 font-semibold py-3 border-b-[.1rem] border-gray-700'>
        Create a post
      </h1>

      <div className='mt-5 w-72 mb-2 bg-[#1A1A1B] p-3'>
        <select
          disabled={disableSelect}
          value={selectOption}
          onChange={(e) => setSelectOption(e.target.value)}
          className='bg-[#1A1A1B] w-full outline-none'>
          {selectOption && (
            <option
              disabled={true}
              className='hidden'>
              {selectOption}
            </option>
          )}
          <option
            disabled={true}
            className='bg-gray-700'>
            Communities you follow ▼
          </option>
          {userCommunitiesList?.map(
            ({ name, _id }) =>
              selectOption !== name && <option key={_id}>{name}</option>
          )}
          <option
            disabled={true}
            className='bg-gray-700'>
            Your communities ▼
          </option>
          {modCommunitiesList?.map(
            ({ name, _id }) =>
              selectOption !== name && <option key={_id}>{name}</option>
          )}
        </select>
      </div>

      <div className=' bg-[#1A1A1B] rounded-lg p-3 '>
        <form
          className='flex flex-col gap-8'
          onSubmit={onSubmit}>
          <label className='pb-3 text-sm font-semibold'>
            Title
            <Input
              {...register('title')}
              className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
              placeholder='Title'
            />
          </label>
          <label className='pb-3 text-sm font-semibold '>
            Description
            <Textarea
              {...register('content')}
              rows={8}
              className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
              placeholder='Text...'
            />
          </label>
          <label className='pb-3 text-sm font-semibold '>
            Add Photo
            <Input
              {...register('image')}
              type='file'
              className='border-[.1rem] text-[#f2f2f1] border-gray-700 bg-[#1A1A1B]'
            />
          </label>
          {/* <span className='flex justify-end gap-5'>
            <button onClick={() => navigate(-1)}>Cancel</button>
            <button type='submit'>Submit</button>
          </span> */}
          <div className='flex justify-end gap-5 mt-3'>
            {isLoading ? (
              <Loading isLoading={isLoading} />
            ) : (
              <>
                <button
                  className='px-5 py-3 bg-[#223237] rounded-2xl'
                  type='button'
                  disabled={isLoading}
                  onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
