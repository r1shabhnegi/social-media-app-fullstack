import {
  useGetAllPostsQuery,
  useGetRecentPostsQuery,
} from "@/api/queries/postQuery";
import CommonLoader from "@/components/CommonLoader";
import CreateCommunity from "@/components/CreateCommunity";
import PageLoader from "@/components/PageLoader";
import PostCard from "@/components/PostCard";
import { RootState } from "@/global/_store";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const navigate = useNavigate();
  const [openCreateCom, setOpenCreateCom] = useState<boolean>(false);
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [page, setPage] = useState<number>(0);
  const { numberOfPosts } = useSelector((state: RootState) => state.posts);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: postsFetchedData,
    refetch: fetchPostsData,
    isLoading,
  } = useGetAllPostsQuery(page);

  const { data: recentPosts } = useGetRecentPostsQuery("");

  console.log("recentPosts", recentPosts);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <div className='bg-[#0B1416] border-[0.01rem] rounded-lg mb-5 border-gray-600 h-10 gap-1 w-full flex justify-center items-center p-1'>
            <div className='border-[0.01rem] rounded-lg border-gray-600 h-8 w-full'></div>
            <div className='text-gray-400 font-bold rounded-lg border-[0.01rem] border-gray-600 flex items-center justify-center h-8 bg-[#0B1416] w-36'>
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
      <div className='sticky hidden lg:flex gap-4 flex-col mr-3 p-4 bg-[#162226] rounded-lg md:block top-20 h-min md:w-60 lg:w-72 xl:w-80'>
        <div
          className='bg-[#131A1D] flex cursor-pointer rounded-lg hover:bg-[#1a282d] py-4 items-center gap-4 text-sm px-5'
          onClick={() => setOpenCreateCom(!openCreateCom)}>
          <IoAdd className='size-6' />
          <p>Create a community</p>
        </div>
        <div
          className='bg-[#131A1D] flex cursor-pointer rounded-lg hover:bg-[#1a282d] py-4 items-center gap-4 text-sm px-5'
          onClick={() => navigate("/submit")}>
          <IoAdd className='size-6' />
          <p>Create a Post</p>
        </div>
        <div className='bg-[#131A1D] flex-col flex rounded-lg  py-1.5 gap-6 text-sm px-3 '>
          <h2 className='font-semibold'>Recent Posts</h2>
          {recentPosts?.map((post: postDataType) => (
            <div
              key={post._id}
              // onClick={}
              className='flex hover:bg-[#1a282d] px-1.5 py-2 rounded-md cursor-pointer items-center justify-start w-full gap-5'>
              {/* <span> */}
              <Avatar className='size-8 sm:size-9'>
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback className='bg-gray-700'>
                  {post.authorName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className='font-semibold line-clamp-2'>{post.title}</p>
              {/* </span> */}
            </div>
          ))}
        </div>
      </div>
      {openCreateCom && (
        <CreateCommunity cancelBtn={() => setOpenCreateCom(!openCreateCom)} />
      )}
    </div>
  );
};
export default Home;
