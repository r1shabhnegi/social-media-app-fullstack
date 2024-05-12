import { useGetPostDetailsQuery } from '@/api/queries/postQuery';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  console.log(id);

  const { data } = useGetPostDetailsQuery(id);
  console.log(data);

  return <div>PostDetail</div>;
};
export default PostDetail;
