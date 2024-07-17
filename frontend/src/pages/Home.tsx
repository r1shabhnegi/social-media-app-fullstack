import { useGetAllPostsQuery } from "@/api/queries/postQuery";
import CommonLoader from "@/components/CommonLoader";
import PageLoader from "@/components/PageLoader";
import PostCard from "@/components/PostCard";
import { RootState } from "@/global/_store";
import { postDataType } from "@/lib/types";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

const Home = () => {
  const { numberOfPosts } = useSelector((state: RootState) => state.posts);
  const [hasMore, setHasMore] = useState(true);
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [page, setPage] = useState<number>(0);

  const {
    data: postsFetchedData,
    refetch: fetchPostsData,
    isLoading,
  } = useGetAllPostsQuery(page);

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
  isLoading && <PageLoader />;
  return (
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
  );
};
export default Home;
