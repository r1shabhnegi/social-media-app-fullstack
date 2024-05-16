import { multiFormatDateString } from '@/lib/checkDate';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { FaRegBookmark, FaRegCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BiSolidUpvote } from 'react-icons/bi';
import { BiSolidDownvote } from 'react-icons/bi';
import { MdBookmarkBorder } from 'react-icons/md';
import { MdOutlineBookmark } from 'react-icons/md';
import {
  useDownVoteMutation,
  useGetPostStatsQuery,
  useSavePostMutation,
  useUpVoteMutation,
} from '@/api/queries/postQuery';
import { showToast } from '@/global/toastSlice';

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

const PostCard = ({ postData }: { postData: postDataType }) => {
  const dispatch = useDispatch<AppDispatch>();

  const createAt = multiFormatDateString(postData.createdAt);
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data: postsStats } = useGetPostStatsQuery({
    postId: postData._id,
    userId,
  });
  const [upVote, { isLoading: loadingUpvote }] = useUpVoteMutation();
  const [downVote, { isLoading: loadingDownvote }] = useDownVoteMutation();
  const [savePost, { isLoading: loadingSavePost }] = useSavePostMutation();

  const handleUpVote = async () => {
    try {
      await upVote({ postId: postData._id, userId });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownVote = async () => {
    try {
      await downVote({ postId: postData._id, userId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePosts = async () => {
    const res = await savePost({ postId: postData._id, userId }).unwrap();
    if (res.code == '11') {
      dispatch(showToast({ message: res.message, type: 'SUCCESS' }));
    }
    if (res.code == '22') {
      dispatch(showToast({ message: res.message, type: 'SUCCESS' }));
    }
  };

  return (
    <div className='overflow-auto border-t-2 border-gray-700 bg-re-400 '>
      <div className='p-4 hover:bg-[#131d20] my-4 rounded-md flex flex-col gap-4'>
        <div className='flex items-center justify-start gap-2'>
          <Avatar className='size-8 sm:size-10 hover:cursor-pointer'>
            <AvatarImage
              className='object-cover'
              src={postData.authorAvatar}
            />
            <AvatarFallback className='object-cover bg-gray-800'>
              {postData.authorName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col justify-center'>
            <Link
              to={`/community/${postData.communityName}`}
              className='-mt-[.3rem] text-sm font-semibold hover:underline cursor-pointer'>
              r/{postData.communityName}
            </Link>
            <p className='text-xs'>
              by
              <span className='ml-1 cursor-pointer hover:underline'>
                <Link to={`/profile/${postData.authorName}`}>
                  {postData.authorName}
                </Link>
              </span>
              {` • ${createAt}`}
            </p>
          </div>
        </div>

        <Link to={`/post/${postData._id}`}>
          <div className='mb-2'>
            <h1 className='mb-3 text-lg font-semibold'>{postData.title}</h1>
            <p className='text-sm text-gray-300'>{postData.content}</p>
          </div>
          <div>
            {postData.image && (
              <img
                className='w-full rounded-md'
                src={postData.image}
              />
            )}
          </div>
        </Link>

        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-between gap-3 px-3 py-1.5 bg-gray-700 rounded-full'>
            <button
              onClick={handleUpVote}
              disabled={loadingUpvote || loadingDownvote}>
              {postsStats?.isUpvoted ? (
                <BiSolidUpvote className='size-6' />
              ) : (
                <BiUpvote className='size-6' />
              )}
            </button>
            <p className='text-xl '>{postsStats?.totalScore}</p>
            <button
              onClick={handleDownVote}
              disabled={loadingUpvote || loadingDownvote}>
              {postsStats?.isDownvoted ? (
                <BiSolidDownvote className='size-6' />
              ) : (
                <BiDownvote className='size-6' />
              )}
            </button>
          </div>

          <button className='flex items-center justify-center px-[1rem] py-[.7rem] bg-gray-700 rounded-full'>
            <FaRegCommentAlt className='-mb-1 size-5' />
            {/* <p className='ml-2 text-xl '>{downVotes}</p> */}
          </button>
          <button
            className='flex items-center justify-center px-[1rem] py-[0.6rem]  bg-gray-700 rounded-full'
            onClick={handleSavePosts}>
            {postsStats?.postSaved ? (
              <MdBookmarkBorder className='-mb-1 size-6' />
            ) : (
              <MdOutlineBookmark className='-mb-1 size-6' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
