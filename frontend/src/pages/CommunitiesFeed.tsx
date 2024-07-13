import { useCommunitiesFeedPostsQuery } from "@/api/queries/postQuery";
import CommonLoader from "@/components/CommonLoader";
import PageLoader from "@/components/PageLoader";
import PostCard from "@/components/PostCard";
import { postDataType } from "@/lib/types";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const CommunitiesFeed = () => {
  // const { numberOfPosts } = useSelector((state: RootState) => state.posts);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [page, setPage] = useState<number>(1);

  const {
    data: postsFetchedData,
    refetch: fetchPostsData,
    isLoading,
  } = useCommunitiesFeedPostsQuery(page);

  useEffect(() => {
    if (postsFetchedData) {
      setNumberOfPosts(postsFetchedData.numberOfPosts);
      setPostsData((prev) => [...prev, ...postsFetchedData.posts]);
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
export default CommunitiesFeed;
