import { useGetCommunityQuery } from '@/api/queries/communityQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import Loading from '@/components/Loading';
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
      <div className='flex'></div>
    </div>
  );
};
export default CommunityPage;
