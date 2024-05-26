import { useGetAllPostsQuery } from '@/api/queries/postQuery';
import CommonLoader from '@/components/CommonLoader';
import PageLoader from '@/components/PageLoader';
import PostCard from '@/components/PostCard';
import { RootState } from '@/global/_store';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
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
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [page, setPage] = useState<number>(0);
  const { numberOfPosts } = useSelector((state: RootState) => state.posts);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: postsFetchedData,
    refetch: fetchPostsData,
    isLoading,
  } = useGetAllPostsQuery(page);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (postsFetchedData) {
      setPostsData((prev) => [...prev, ...postsFetchedData]);
    }
  }, [postsFetchedData]);

  const fetchMorePostsData = async () => {
    setPage((prev) => prev + 1);
    if (postsData.length < numberOfPosts) {
      await fetchPostsData();
    } else {
      setHasMore(false);
    }
  };

  isLoading && <PageLoader isLoading={isLoading} />;
  return (
    <div className='flex max-w-[65rem] mx-auto justify-center min-h-screen gap-16 py-5'>
      <div className='flex-1 mx-0.5'>
        <Link to='/submit'>
          <div className='bg-[#0B1416] border-[0.01rem] mb-5 border-gray-600 h-10 gap-1 w-full flex justify-center items-center p-1'>
            <div className='border-[0.01rem] border-gray-600 h-8 w-full'></div>
            <div className='text-gray-400 font-bold border-[0.01rem] border-gray-600 flex items-center justify-center h-8 bg-[#0B1416] w-36'>
              Create
            </div>
          </div>
        </Link>
        <InfiniteScroll
          className='flex flex-col items-center justify-center'
          dataLength={postsData.length}
          hasMore={hasMore}
          loader={<CommonLoader />}
          next={fetchMorePostsData}>
          {postsData?.map((postData: postDataType, i: number) => (
            <PostCard
              postData={postData}
              key={postData._id + i / 3}
            />
          ))}
        </InfiniteScroll>

        {/* <CommonLoader isLoading={postsLoading} /> */}
      </div>
      <div className='sticky hidden mr-3 bg-gray-600 rounded-lg md:block top-20 h-min md:w-60 lg:w-72 xl:w-80'>
        sidebar
      </div>
    </div>
  );
};
export default Home;
