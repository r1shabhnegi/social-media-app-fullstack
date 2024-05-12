import { multiFormatDateString } from '@/lib/checkDate';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  useAddUpVoteMutation,
  useGetPostStatsQuery,
} from '@/api/queries/postQuery';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { FaRegBookmark, FaRegCommentAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

type postDataType = {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  createdAt: string;
  image: string;
  downVotes: number;
  upVotes: number;
  authorAvatar: string;
  _id: string;
};

const PostCard = ({ postData }: { postData: postDataType }) => {
  const navigate = useNavigate();
  const createAt = multiFormatDateString(postData.createdAt);

  const { data: postStats } = useGetPostStatsQuery(postData._id);
  const { userId } = useSelector((state: RootState) => state.auth);
  // console.log(userId);
  // console.log(postId);

  const [addUpVote] = useAddUpVoteMutation();

  const handleUpVoteClick = async () => {
    await addUpVote({ userId: userId, postId: postData._id });
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
            {postData.authorName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col justify-center'>
          <Link to={`/community/${postData.communityName}`}>
            <p
              className='-mt-[.3rem] text-sm font-semibold hover:underline cursor-pointer'
              // onClick={() =>
              //   navigate(`/community/${postData.communityName}`)
              // }
            >
              r/{postData.communityName}
            </p>
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
          {postData?.image && (
            <img
              className='w-full'
              src={postData?.image}
            />
          )}
        </div>
      </Link>

      <div className='flex items-center gap-4 mb-5'>
        <div className='flex items-center justify-between gap-3 px-3 py-2 bg-gray-700 rounded-full'>
          <button onClick={handleUpVoteClick}>
            <BiUpvote className='size-6' />
          </button>
          <p className='text-xl '>{postStats?.upVotes}</p>
          <button>
            <BiDownvote className='size-6' />
          </button>
        </div>

        <button className='flex items-center justify-center px-3 py-2 bg-gray-700 rounded-full'>
          <FaRegCommentAlt className='-mb-1 size-5' />
          <p className='ml-2 text-xl '>{postStats?.upVotes}</p>
        </button>
        <button className='flex items-center justify-center px-4 py-[0.8rem] bg-gray-700 rounded-full'>
          <FaRegBookmark className='-mb-1 size-5' />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
