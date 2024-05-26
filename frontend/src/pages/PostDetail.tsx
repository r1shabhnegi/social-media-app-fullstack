import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from '@/api/queries/commentQuery';
import {
  useLazyPostDetailsCommunityInfoQuery,
  usePostDetailsCommunityInfoQuery,
  usePostDetailsQuery,
} from '@/api/queries/postQuery';
import CommunityRightSideBar from '@/components/CommunityRightSideBar';
import PageLoader from '@/components/PageLoader';
import PostCard from '@/components/PostCard';
import { RootState } from '@/global/_store';
import { showToast } from '@/global/toastSlice';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

type commentT = {
  content: string;
};

type CommentData = {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  postId: string;
  reply: string[];
};
const PostDetail = () => {
  const navigate = useNavigate();
  const [commentPage, setCommentPage] = useState(0);
  const [comments, setComments] = useState<CommentData[]>([]);
  const dispatch = useDispatch();
  const { id: postId } = useParams();
  const { userId, username } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset } = useForm<commentT>();

  const {
    data: postData,
    isLoading: postDataLoading,
    isSuccess,
  } = usePostDetailsQuery(postId);

  const { refetch } = useGetCommentsQuery({ postId, commentPage });

  const [CommunityInfoFetch, { data: CommunityInfo }] =
    useLazyPostDetailsCommunityInfoQuery();

  useEffect(() => {
    if (postData && isSuccess) {
      const fetch = async () => {
        const res = await CommunityInfoFetch(postData?.communityId).unwrap();
      };
      fetch();
    }
  }, [CommunityInfoFetch, isSuccess, postData]);

  useEffect(() => {
    const fetchComment = async () => {
      const res = await refetch().unwrap();
      if (res) {
        setComments((prevComment) => [...prevComment, ...res]);
      }
    };
    fetchComment();
  }, [commentPage, refetch]);

  const handleCommentPagination = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setCommentPage((prev) => prev + 1);
    }
  };
  console.log(commentPage);
  useEffect(() => {
    window.addEventListener('scroll', handleCommentPagination);

    return () => window.removeEventListener('scroll', handleCommentPagination);
  });

  console.log(comments);
  const [createComment, { isLoading: creatingComment }] =
    useCreateCommentMutation();

  const submitComment = handleSubmit(async (data) => {
    console.log(data.content);

    const res = await createComment({
      userId,
      username,
      postId,
      content: data.content,
    }).unwrap();
    console.log(res);
    if (res) {
      reset();
      navigate(0);
      dispatch(showToast({ message: 'Comment created', type: 'SUCCESS' }));
    }
  });

  if (postDataLoading) <PageLoader isLoading={postDataLoading} />;

  return (
    <div className='max-w-[65rem] flex justify-center mx-auto pb-10'>
      <div className='flex gap-20 '>
        <div>
          <PostCard
            postData={postData}
            fromPostDetail={true}
          />
          <div className='mx-2'>
            <form
              onSubmit={submitComment}
              className='flex gap-2'>
              <input
                {...register(
                  'content'
                  // min:{value:10,}
                )}
                className='flex-1 border-gray-500 bg-[#0B1416] border-b-2 focus:outline-0 focus:border-gray-400'
                placeholder='Write a comment'
              />
              <button
                type='submit'
                className='px-2 py-1 bg-[#151f22] hover:border-gray-700 hover:border-[.01rem] rounded-sm'>
                Submit
              </button>
            </form>
            <div>
              {comments?.map((comment) => (
                <div
                  key={comment._id + comment?.content}
                  className='border-[0.1rem] border-gray-700 p-4 rounded-lg my-5'>
                  <p
                    className='text-xs text-gray-400 cursor-pointer hover:underline'
                    onClick={() =>
                      navigate(`/profile/${postData?.authorName}/posts`)
                    }>
                    u/{comment?.authorName}
                  </p>
                  <p className='font-semibold text-gray-300 '>
                    - {comment?.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='hidden mt-8 mr-3 lg:block w-80'>
          <CommunityRightSideBar
            authorName={CommunityInfo?.authorName}
            avatar={CommunityInfo?.avatar}
            description={CommunityInfo?.description}
            name={CommunityInfo?.name}
            rules={CommunityInfo?.rules}
          />
        </div>
      </div>
    </div>
  );
};
export default PostDetail;
