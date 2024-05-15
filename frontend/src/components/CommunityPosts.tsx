import { useGetAllCommunityPostsQuery } from '@/api/queries/postQuery';
import { RootState } from '@/global/_store';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommonLoader from './CommonLoader';
import PostCard from './PostCard';

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

const CommunityPosts = memo(function CommunityPosts({
  communityId,
}: {
  communityId?: string;
}) {
  const [page, setPage] = useState(0);
  const [postsData, setPostsData] = useState<postDataType[]>([]);

  const { numberOfPosts } = useSelector((state: RootState) => state.posts);

  const { refetch: fetchPostsData, isLoading } = useGetAllCommunityPostsQuery({
    communityId,
    page,
  });

  useEffect(() => {
    if (page + 1 * 5 < numberOfPosts) {
      const fetchPosts = async () => {
        try {
          const response = await fetchPostsData().unwrap();
          if (response) {
            console.log(response);
            setPostsData((prev) => [...prev, ...response]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchPosts();
    }
  }, [fetchPostsData, numberOfPosts, page]);

  const handleScrollPagination = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScrollPagination);

    return () => window.removeEventListener('scroll', handleScrollPagination);
  }, []);

  return (
    <div className='flex-1'>
      {isLoading ? (
        <CommonLoader isLoading={isLoading} />
      ) : (
        <>
          {postsData?.map((postData: postDataType) => (
            <PostCard
              postData={postData}
              key={`${postData.title}${postData._id}`}
            />
          ))}
        </>
      )}
    </div>
  );
});
export default CommunityPosts;
