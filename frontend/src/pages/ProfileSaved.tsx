import { useLazyGetUserSavedQuery } from '@/api/queries/userQuery';
import CommonLoader from '@/components/CommonLoader';
import PostCard from '@/components/PostCard';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

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

const ProfileSaved = () => {
  const { username } = useParams();
  const { pathname } = useLocation();

  const [fetchSaved, { data: postsData, isLoading }] =
    useLazyGetUserSavedQuery();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    async function fetch() {
      if (pathname === `/profile/${username}/saved`) {
        fetchSaved(username);
      }
    }
    fetch();
  }, [fetchSaved, pathname, username]);

  isLoading && <CommonLoader />;

  return (
    <div>
      {postsData?.map((savedPost: postDataType) => (
        <PostCard
          postData={savedPost}
          key={savedPost?._id + Math.random() + 12}
        />
      ))}
    </div>
  );
};
export default ProfileSaved;
