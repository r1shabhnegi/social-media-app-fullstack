import { useCommunityPageQuery } from '@/api/queries/communityQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const { name } = useParams();

  const { data } = useCommunityPageQuery(`${name}`);
  console.log(data);

  console.log(name);
  return (
    <div className=''>
      <CommunityBanner />
      <AvatarAndOptions />
    </div>
  );
};
export default CommunityPage;
