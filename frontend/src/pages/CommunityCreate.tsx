import { useForm } from 'react-hook-form';

type CommunityTypes = {
  name: string;
  avatar: File;
  description: string;
  coverImage: File;
  rule: string[];
};

const CommunityCreate = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <div className='flex flex-col py-10 bg-cyan-200'>
      <h1 className='text-2xl font-bold'>Create Community</h1>
      <form onSubmit={onSubmit}>
        <label>
          Community Name
          <input
            type='text'
            {...register('name', {})}
          />
        </label>
      </form>
    </div>
  );
};
export default CommunityCreate;
