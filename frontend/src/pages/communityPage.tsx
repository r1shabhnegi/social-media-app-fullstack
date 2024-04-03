import { useCommunityPageQuery } from '@/api/queries/communityQuery';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const { name } = useParams();

  const { data } = useCommunityPageQuery(`${name}`);
  console.log(data);

  console.log(name);
  return <div className='mx-24 bg-gray-100'>sd</div>;
};
export default CommunityPage;
