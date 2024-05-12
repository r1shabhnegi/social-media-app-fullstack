import { useLazyGetAllCommunityPostsQuery } from '@/api/queries/postQuery';
import { memo, useEffect } from 'react';
import Loading from '../Loading';
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
  createdAt: string;
  image: string;
  downVotes: number;
  upVotes: number;
};

const PostMainSection = memo(function PostMainSection({
  communityId,
  userId,
}: {
  communityId?: number;
  userId?: number;
}) {
  const [fetchCommunityPost, { isLoading, data }] =
    useLazyGetAllCommunityPostsQuery();

  useEffect(() => {
    if (communityId && !userId) {
      fetchCommunityPost(communityId);
    }
  }, [communityId, fetchCommunityPost, userId]);

  isLoading && <Loading isLoading={isLoading} />;

  return (
    <div className='flex-1'>
      {data?.map((postData: postDataType) => (
        <div key={postData._id}>
          <PostCard postData={postData} />
        </div>
      ))}
    </div>
  );
});

export default PostMainSection;
