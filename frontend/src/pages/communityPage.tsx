import { useGetCommunityMutation } from '@/api/queries/communityQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import Loading from '@/components/Loading';
import { RootState } from '@/global/_store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const { name: communityName } = useParams();
  const { userId } = useSelector((state: RootState) => state.auth);

  const [getCommunity, { data, isLoading }] = useGetCommunityMutation();

  useEffect(() => {
    async function fetch() {
      await getCommunity({ communityName });
    }
    fetch();
  }, [communityName, getCommunity]);

  let community;
  let isMod;

  if (data) {
    community = data[0];
    isMod = userId === community?.author;
  }
  console.log(community);
  if (isLoading) return <Loading isLoading={isLoading} />;

  return (
    <div className=''>
      <CommunityBanner />
      <AvatarAndOptions
        isMod={isMod}
        communityName={communityName}
        userId={userId}
      />
    </div>
  );
};
export default CommunityPage;
