import { multiFormatDateString } from '@/lib/checkDate';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { FaRegBookmark, FaRegCommentAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { BiSolidUpvote } from 'react-icons/bi';
import { BiSolidDownvote } from 'react-icons/bi';
import { MdBookmarkBorder } from 'react-icons/md';
import { MdOutlineBookmark } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { MdModeEditOutline } from 'react-icons/md';
import {
  useDeletePostMutation,
  useDownVoteMutation,
  // useGetPostStatsQuery,
  useLazyGetPostStatsQuery,
  useSavePostMutation,
  useUpVoteMutation,
} from '@/api/queries/postQuery';
import { showToast } from '@/global/toastSlice';
import { MdDelete } from 'react-icons/md';
import { useEffect } from 'react';

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

const PostCard = ({
  postData,
  fromPostDetail,
}: {
  postData: postDataType;
  fromPostDetail?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const createAt = multiFormatDateString(postData?.createdAt);
  const { userId } = useSelector((state: RootState) => state.auth);
  const [fetchPostStats, { data: postsStats, isLoading: loadingStats }] =
    useLazyGetPostStatsQuery();

  useEffect(() => {
    if (postData?._id) {
      const fetchStats = async () => {
        try {
          const res = await fetchPostStats({
            postId: postData?._id,
            userId,
          }).unwrap();

          if (!res) throw new Error('Error fetching post data');
        } catch (error) {
          console.log(error);
        }
      };
      fetchStats();
    }
  }, [fetchPostStats, postData, userId]);

  const [upVote, { isLoading: loadingUpVote }] = useUpVoteMutation();
  const [downVote, { isLoading: loadingDownVote }] = useDownVoteMutation();
  const [savePost, { isLoading: loadingSavePost }] = useSavePostMutation();
  const [deletePostQuery] = useDeletePostMutation();

  const handleUpVote = async () => {
    try {
      await upVote({ postId: postData?._id, userId });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownVote = async () => {
    try {
      await downVote({ postId: postData?._id, userId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePosts = async () => {
    const res = await savePost({ postId: postData?._id, userId }).unwrap();
    if (res.code == '11') {
      dispatch(showToast({ message: res.message, type: 'SUCCESS' }));
    }
    if (res.code == '22') {
      dispatch(showToast({ message: res.message, type: 'SUCCESS' }));
    }
  };

  const deletePost = async () => {
    const res = await deletePostQuery({ postId: postData?._id, userId });
    if (res) {
      navigate(0);
      dispatch(
        showToast({ message: 'Post deleted successfully!', type: 'SUCCESS' })
      );
    } else {
      dispatch(showToast({ message: 'Failed Deleting Post!', type: 'ERROR' }));
    }
  };

  const isMod = postData?.authorId === userId;

  return (
    <div
      className={`overflow-auto  ${
        !fromPostDetail ? 'border-t-2 border-gray-700' : ''
      } bg-re-400 w-[40rem]`}>
      <div
        className={`${
          !fromPostDetail ? 'hover:bg-[#131d20] my-4' : ''
        } p-4 rounded-md flex flex-col gap-4`}>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2'>
            <Avatar className='size-8 sm:size-10 hover:cursor-pointer'>
              <AvatarImage
                className='object-cover'
                src={postData?.authorAvatar}
              />
              <AvatarFallback className='object-cover bg-gray-800'>
                {postData?.authorName?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col justify-center'>
              <Link
                to={`/community/${postData?.communityName}`}
                className='-mt-[.3rem] text-sm font-semibold hover:underline cursor-pointer'>
                r/{postData?.communityName}
              </Link>
              <p className='text-xs'>
                by
                <span className='ml-1 cursor-pointer hover:underline'>
                  <Link to={`/profile/${postData?.authorName}/posts`}>
                    {postData?.authorName}
                  </Link>
                </span>
                {` • ${createAt}`}
              </p>
            </div>
          </div>
          <div>
            {isMod ? (
              <div className='dropdown dropdown-end'>
                <button
                  tabIndex={0}
                  role='button'
                  className='p-2 z-0 hover:bg-[#2d2f2f] rounded-full '>
                  <BsThreeDots className='size-6' />
                </button>
                <ul
                  tabIndex={0}
                  className='mt-5 shadow dropdown-content menu bg-base-100 rounded-box w-44'>
                  {/* <li>
                    <Link to='/'>
                      <a className='flex items-center justify-start gap-3'>
                        <MdModeEditOutline className='size-6' />
                        <p className='text-base'>Edit Post</p>
                      </a>
                    </Link>
                  </li> */}
                  <li onClick={deletePost}>
                    <a className='flex items-center justify-start gap-3'>
                      <MdDelete className=' size-6' />
                      <p className='text-base'>Delete Post</p>
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div
          onClick={() => !fromPostDetail && navigate(`/post/${postData?._id}`)}
          className={`${!fromPostDetail && 'cursor-pointer'}`}>
          <div className='mb-2'>
            <h1 className='mb-3 text-lg font-semibold'>{postData?.title}</h1>
            <p className='text-sm text-gray-300'>{postData?.content}</p>
          </div>
          <div>
            {postData?.image && (
              <img
                className='w-full rounded-md'
                src={postData?.image}
              />
            )}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-between gap-3 px-3 py-1.5 bg-gray-700 rounded-full'>
            <button
              onClick={handleUpVote}
              disabled={loadingUpVote || loadingDownVote}>
              {postsStats?.isUpvoted ? (
                <BiSolidUpvote className='size-6' />
              ) : (
                <BiUpvote className='size-6' />
              )}
            </button>
            <p className='text-xl '>{postsStats?.totalScore}</p>
            <button
              onClick={handleDownVote}
              disabled={loadingUpVote || loadingDownVote}>
              {postsStats?.isDownvoted ? (
                <BiSolidDownvote className='size-6' />
              ) : (
                <BiDownvote className='size-6' />
              )}
            </button>
          </div>

          {!fromPostDetail ? (
            <button
              className='flex items-center justify-center px-3 py-1.5 bg-gray-700 rounded-full'
              onClick={() => navigate(`/post/${postData?._id}`)}>
              <FaRegCommentAlt className='-mb-1 size-5' />
              <p className='ml-3 text-xl'>{postsStats?.totalComments}</p>
            </button>
          ) : null}
          <button
            disabled={loadingSavePost}
            className='flex items-center justify-center px-[1rem] py-[0.6rem]  bg-gray-700 rounded-full'
            onClick={handleSavePosts}>
            {postsStats?.postSaved ? (
              <MdOutlineBookmark className='-mb-1 size-6' />
            ) : (
              <MdBookmarkBorder className='-mb-1 size-6' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
