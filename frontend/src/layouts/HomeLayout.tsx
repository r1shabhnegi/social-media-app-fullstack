import { useGetRecentPostsQuery } from "@/api/queries/postQuery";
import CreateCommunity from "@/components/CreateCommunity";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postDataType } from "@/lib/types";

const HomeLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openCreateCom, setOpenCreateCom] = useState<boolean>(false);
  const { data: recentPosts } = useGetRecentPostsQuery("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className='flex max-w-[65rem] mx-auto w-full justify-center min-h-screen md:gap-6 lg:gap-4 xl:gap-16 py-5'>
      <div className='flex flex-col flex-1'>
        <Link
          to='/submit'
          className='hidden w-full md:block'>
          <div className=' bg-[#0B1416] border-[0.01rem] rounded-lg mb-5 border-gray-600 h-10 gap-1 w-full flex justify-center items-center p-1'>
            <div className='border-[0.01rem] rounded-lg border-gray-600 h-8 w-full'></div>
            <div className='text-gray-400 font-bold rounded-lg border-[0.01rem] border-gray-600 flex items-center justify-center h-8 bg-[#0B1416] w-36'>
              Create
            </div>
          </div>
        </Link>
        <div className='flex w-full'>
          <div
            className={`flex-1 py-3 sm:py-5 cursor-pointer text-center ${
              pathname === "/" ? "border-b border-gray-200 font-semibold " : ""
            }`}
            onClick={() => navigate("/")}>
            <p className='text-xs sm:text-sm'>Home feed</p>
          </div>
          <div
            className={`flex-1 py-3 sm:py-5 text-center cursor-pointer ${
              pathname === "/following-feed"
                ? "border-b border-gray-200 font-semibold "
                : ""
            }`}
            onClick={() => navigate("/following-feed")}>
            <p className='text-xs sm:text-sm'>Communities feed</p>
          </div>
        </div>
        <Outlet />

        {/* <CommonLoader isLoading={postsLoading} /> */}
      </div>
      {/* <div className=''> */}
      <div className=' sticky hidden lg:flex gap-4 flex-col mr-3 p-4 bg-[#162226] rounded-lg md:block top-20 h-min max-h-[40rem] lg:w-80 md:w-72 xl:w-80'>
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
        {recentPosts && recentPosts.length > 0 ? (
          <div className='overflow-y-auto bg-[#131A1D] flex-col flex rounded-lg  py-1.5 gap-6 text-sm px-3 '>
            <h2 className='font-semibold'>Recent Posts</h2>

            {recentPosts?.map((post: postDataType) => (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className='flex hover:bg-[#1a282d] px-1.5 py-2 rounded-md cursor-pointer items-center justify-start w-full gap-5'>
                <Avatar className='size-8 sm:size-9'>
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback className='bg-gray-700'>
                    {post.authorName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className='font-semibold line-clamp-2'>{post.title}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {/* </div> */}
      {openCreateCom && (
        <CreateCommunity cancelBtn={() => setOpenCreateCom(!openCreateCom)} />
      )}
    </div>
  );
};
export default HomeLayout;
