import { useLazyGetUserCommentsQuery } from '@/api/queries/userQuery';
import CommonLoader from '@/components/CommonLoader';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ProfileComments = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { pathname } = useLocation();
  const [fetchComments, { data: commentsData, isLoading }] =
    useLazyGetUserCommentsQuery();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    async function fetch() {
      if (pathname === `/profile/${username}/comments`) {
        fetchComments(username);
      }
    }
    fetch();
  }, [fetchComments, pathname, username]);

  isLoading && <CommonLoader />;

  return (
    <div>
      {commentsData?.map((comment) => (
        <div
          key={comment._id + comment?.content}
          className='border-[0.1rem] w-80 sm:w-[35rem] border-gray-700 p-4 rounded-lg my-5 flex justify-between items-center'>
          <div>
            <p className='text-xs text-gray-400 cursor-pointer hover:underline'>
              u/{comment?.authorName}
            </p>
            <p className='font-semibold text-gray-300 '>- {comment?.content}</p>
          </div>
          {/* <div> */}
          <p
            className='px-1 bg-blue-800 rounded'
            onClick={() => navigate(`/post/${comment?.postId}`)}>
            Post
          </p>
          {/* </div> */}
        </div>
      ))}
    </div>
  );
};
export default ProfileComments;
