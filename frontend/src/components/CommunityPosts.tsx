import {
  useCommunityNumberOfPostsQuery,
  useGetAllCommunityPostsQuery,
} from '@/api/queries/postQuery';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import { useEffect, useState } from 'react';
import CommonLoader from './CommonLoader';
import { useLocation } from 'react-router-dom';

type postDataType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  authorAvatar: string;
  image: string;
  downVotes: number;
  upVotes: number;
  createdAt: string;
};

const CommunityPosts = ({
  communityId,
}: {
  communityId?: string;
  communityName?: string;
}) => {
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [postsData, setPostsData] = useState<postDataType[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { refetch: fetchNumberOfPosts } =
    useCommunityNumberOfPostsQuery(communityId);
  const { pathname } = useLocation();
  useEffect(() => {
    setNumberOfPosts(0);
    setPostsData([]);
    setPage(0);
    setHasMore(true);
  }, [pathname, communityId]);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchNumberOfPosts().unwrap();
      if (res) {
        setNumberOfPosts(res);
      }
    };
    fetch();
  }, [fetchNumberOfPosts]);

  const { data: postsFetchedData, refetch: fetchPostsData } =
    useGetAllCommunityPostsQuery({
      communityId,
      page,
    });

  useEffect(() => {
    if (postsFetchedData) {
      setPostsData((prev) => [...prev, ...postsFetchedData]);
    }
  }, [postsFetchedData]);

  const fetchMorePostsData = async () => {
    setPage((prev) => prev + 1);
    if (postsData.length < numberOfPosts) {
      await fetchPostsData().unwrap();
    } else {
      setHasMore(false);
    }
  };
  return (
    <div className='flex-1'>
      <InfiniteScroll
        dataLength={postsData.length}
        next={fetchMorePostsData}
        hasMore={hasMore}
        loader={<CommonLoader />}>
        {postsData?.map((postData: postDataType) => (
          <PostCard
            postData={postData}
            key={`${postData._id}${Math.random()}`}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default CommunityPosts;
