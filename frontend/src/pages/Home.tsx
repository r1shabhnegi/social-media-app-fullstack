import { useGetAllPostQuery } from '@/api/queries/postQuery';
import CommonLoader from '@/components/CommonLoader';
import PageLoader from '@/components/PageLoader';
import PostCard from '@/components/post/PostCard';
import { useEffect, useState } from 'react';
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
  const [page, setPage] = useState<number>(0);
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [postsLoading, setPostLoading] = useState<boolean>(false);

  const { refetch, isLoading } = useGetAllPostQuery(page);
  useEffect(() => {
    const fetchMorePosts = async () => {
      try {
        setPostLoading(true);
        const res = await refetch().unwrap();
        if (res) {
          setPostsData((prev) => [...prev, ...res]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchMorePosts();
  }, [page, refetch]);

  const handleScrollPagination = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };
  console.log(postsData);
  useEffect(() => {
    window.addEventListener('scroll', handleScrollPagination);

    return () => window.removeEventListener('scroll', handleScrollPagination);
  }, []);

  isLoading && <PageLoader isLoading={isLoading} />;
  return (
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
          {postsData?.map((postData: postDataType) => (
            <PostCard
              postData={postData}
              key={postData._id}
            />
          ))}
        </div>
        <CommonLoader isLoading={postsLoading} />
      </div>
      <div className='bg-red-600 rounded-lg h-min w-80'>sidebar</div>
    </div>
  );
};
export default Home;
