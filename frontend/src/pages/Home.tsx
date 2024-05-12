import { useGetAllPostQuery } from '@/api/queries/postQuery';
import PostCard from '@/components/post/PostCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

type postDataType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  authorAvatar: string;
  createdAt: string;
  image: string;
  downVotes: number;
  upVotes: number;
};

const Home = () => {
  const { data } = useGetAllPostQuery({});
  console.log(data);
  return (
    <ScrollArea
      className='w-full overflow-hidden rounded-md'
      style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div className='flex min-h-screen gap-16 py-5 mx-20'>
        <div className='flex-1'>
          <Link to='/submit'>
            <div className='bg-[#0B1416] border-[0.01rem] mb-5 border-gray-600 h-10 gap-1 w-full flex justify-center items-center p-1'>
              <div className='border-[0.01rem] border-gray-600 h-8 w-full'></div>
              <div className='text-gray-400 font-bold border-[0.01rem] border-gray-600 flex items-center justify-center h-8 bg-[#0B1416] w-36'>
                Create
              </div>
            </div>
          </Link>
          <div>
            {data?.map((postData: postDataType) => (
              <PostCard
                postData={postData}
                key={postData._id}
              />
            ))}
          </div>
        </div>
        <div className='bg-red-600 rounded-lg h-min w-80'>sidebar</div>
      </div>
    </ScrollArea>
  );
};
export default Home;
