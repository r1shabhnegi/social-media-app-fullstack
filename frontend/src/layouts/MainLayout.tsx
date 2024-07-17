import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import LeftSideBar from "@/components/LeftSideBar";
import { useNumberOfPostsQuery } from "@/api/queries/postQuery";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/global/_store";
import { setNumberOfPosts } from "@/global/postsSlice";
// import PageLoader from "@/components/PageLoader";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isSuccess } = useNumberOfPostsQuery({});

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setNumberOfPosts(data));
    }
  }, [data, dispatch, isSuccess]);

  return (
    <main className=' flex flex-col min-h-screen bg-[#0b1416] text-white'>
      <Header />
      <div className='hidden lg:inline'>
        <LeftSideBar />
      </div>
      <div className='lg:ml-[17rem]'>
        <Outlet />
      </div>
    </main>
  );
};
export default Layout;
