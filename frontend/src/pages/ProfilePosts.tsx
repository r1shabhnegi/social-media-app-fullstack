import { useGetUserPostsQuery } from '@/api/queries/userQuery';
import CommonLoader from '@/components/CommonLoader';
import PostCard from '@/components/PostCard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

const ProfilePosts = () => {
  const { username } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: postsData, isLoading } = useGetUserPostsQuery(username);

  isLoading && <CommonLoader isLoading={isLoading} />;

  return (
    <div>
      {postsData?.map((postData: postDataType) => (
        <PostCard
          postData={postData}
          key={postData._id + Math.random()}
        />
      ))}
    </div>
  );
};
export default ProfilePosts;
