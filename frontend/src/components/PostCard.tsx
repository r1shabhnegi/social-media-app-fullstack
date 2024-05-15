import { multiFormatDateString } from '@/lib/checkDate';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { FaRegBookmark, FaRegCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BiSolidUpvote } from 'react-icons/bi';
import { BiSolidDownvote } from 'react-icons/bi';
import {
  useDownVoteMutation,
  useGetPostStatsQuery,
  useUpVoteMutation,
} from '@/api/queries/postQuery';

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
  const createAt = multiFormatDateString(postData.createdAt);
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data: postsStats } = useGetPostStatsQuery({
    postId: postData._id,
    userId,
  });
  const [upVote, { isLoading: loadingUpvote }] = useUpVoteMutation();
  const [downVote, { isLoading: loadingDownvote }] = useDownVoteMutation();
  console.log(postsStats);
  const handleUpVote = async () => {
    const response = await upVote({ postId: postData._id, userId });
    console.log(response);
  };
  const handleDownVote = async () => {
    const response = await downVote({ postId: postData._id, userId });
    // console.log(response);
  };

  return (
    <div className='flex flex-col gap-4 overflow-auto bg-re-400 '>
      <div className='flex items-center justify-start gap-2 pt-5 border-t-2 border-gray-700'>
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
        <div className=''>
          <h1 className='mb-3 text-lg font-semibold'>{postData.title}</h1>
          <p className='text-sm text-gray-300'>{postData.content}</p>
        </div>
        <div>
          {postData.image && (
            <img
              className='w-full'
              src={postData.image}
            />
          )}
        </div>
      </Link>

      <div className='flex items-center gap-4 mb-5'>
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
        <button className='flex items-center justify-center px-[1rem] py-[.7rem]  bg-gray-700 rounded-full'>
          <FaRegBookmark className='-mb-1 size-5' />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
