import { useGetCommunityQuery } from '@/api/queries/communityQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import { ScrollArea } from '@/components/ui/scroll-area';
import CommunityRightSideBar from '@/components/CommunityPage/CommunityRightSideBar';
import Loading from '@/components/Loading';
import PostMainSection from '@/components/post/PostMainSection';
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

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCurrentCommunity(data));
    }
  }, [isSuccess, dispatch, data]);

  const isMod = userId === data?.author;
  console.log(data);

  if (isLoading) return <Loading isLoading={isLoading} />;
  return (
    <ScrollArea className='w-full overflow-hidden h-[44rem] rounded-md '>
      <CommunityBanner coverImg={data?.coverImg} />
      <AvatarAndOptions
        isMod={isMod}
        rules={data?.rules}
        communityName={communityName}
        avatarImg={data?.avatarImg}
        userId={userId}
      />
      <div className='flex mt-10 w-full gap-20  max-w-[70rem]  mx-auto'>
        <PostMainSection communityId={data?._id} />
        <CommunityRightSideBar
          description={data?.description}
          author={data?.author}
          communityName={communityName}
          rules={data?.rule}
        />
      </div>
    </ScrollArea>
  );
};
export default CommunityPage;
