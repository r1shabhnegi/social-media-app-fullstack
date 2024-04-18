import { useLazyGetUserCommunitiesQuery } from '@/api/queries/communityQuery';
import { AppDispatch, RootState } from '@/global/_store';
import { userCommunitiesList } from '@/global/communitySlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CommunitiesList = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [communitiesList, { data }] = useLazyGetUserCommunitiesQuery();

  useEffect(() => {
    if (isLoggedIn) {
      communitiesList({});
    }
  }, [isLoggedIn, communitiesList]);

  useEffect(() => {
    if (data) {
      dispatch(userCommunitiesList(data));
    }
  }, [data, dispatch]);

  console.log(data);

  return <span className=''></span>;
};
export default CommunitiesList;
