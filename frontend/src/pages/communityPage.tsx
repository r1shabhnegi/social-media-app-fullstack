import { useGetCommunityQuery } from '@/api/queries/communityQuery';
import { useGetCommunityPostsQuery } from '@/api/queries/postQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import CommunityRightSideBar from '@/components/CommunityPage/CommunityRightSideBar';
import Loading from '@/components/Loading';
import PostSection from '@/components/PostSection';
import { AppDispatch, RootState } from '@/global/_store';
import { setCurrentCommunity } from '@/global/communitySlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name: communityName } = useParams();
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isSuccess } = useGetCommunityQuery(
    `${communityName}`
  );
  const { data: communityPosts } = useGetCommunityPostsQuery(data?._id);

  console.log(communityPosts);
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCurrentCommunity(data));
    }
  }, [isSuccess, dispatch, data]);
  console.log(data);
  if (isLoading) return <Loading isLoading={isLoading} />;
  console.log(data);
  const isMod = userId === data?.author;
  return (
    <div className=''>
      <CommunityBanner coverImg={data?.coverImg} />
      <AvatarAndOptions
        isMod={isMod}
        description={data?.description}
        rules={data?.rules}
        communityName={communityName}
        avatarImg={data?.avatarImg}
        userId={userId}
      />
      <div className='flex mt-10 w-full  max-w-[70rem] sm:h-20  md:h-32 mx-auto'>
        <PostSection
          _id={data?._id}
          postData={communityPosts}
        />
        <CommunityRightSideBar />
      </div>
    </div>
  );
};
export default CommunityPage;
