import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PostTypes = {
  title: string;
  description: string;
};

const CreatePost = ({
  selectedCommunity,
}: {
  selectedCommunity: {
    communityName: string;
  };
}) => {
  const [selectOption, setSelectOption] = useState<string>('');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { userCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  useEffect(() => {
    if (selectedCommunity) {
      setSelectOption(selectedCommunity.communityName);
    }
  }, [selectedCommunity]);

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <div className='w-[45rem] mr-5 '>
      <h1 className='px-1 font-semibold py-3 border-b-[.1rem] border-gray-700'>
        Create a post
      </h1>

      <div className='mt-5 w-72 mb-2 bg-[#1A1A1B] p-3'>
        <select
          value={selectOption}
          onChange={(e) => setSelectOption(e.target.value)}
          className='bg-[#1A1A1B] w-full outline-none'>
          {selectOption && <option>{selectOption}</option>}

          {userCommunitiesList?.map(
            ({ name, _id }) =>
              selectOption !== name && (
                <option
                  className='p'
                  key={_id}>
                  {name}
                </option>
              )
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
              rows={8}
              className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
              placeholder='Text...'
            />
          </label>

          <label className='pb-3 text-sm font-semibold '>
            Add Photo
            <Input
              type='file'
              className='border-[.1rem] text-[#f2f2f1] border-gray-700 bg-[#1A1A1B]'
            />
          </label>

          <span className='flex justify-end gap-5'>
            <button onClick={() => navigate(-1)}>Cancel</button>
            <button type='submit'>Submit</button>
          </span>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
