import { useServerStatusQuery } from './api/queries/authQuery';
import Loading from './components/Loading';
import Error from './components/Error';
import PagesContainer from './PagesContainer';
import Toast from './components/Toast';
import PersistentUser from './PersistentUser';

const App = () => {
  const { isError, isLoading } = useServerStatusQuery({});

  if (isLoading || isError) {
    isLoading ? (
      <Loading isLoading={isLoading} />
    ) : (
      <Error error={'Server Is Down'} />
    );
  }

  return (
    <PersistentUser>
      <PagesContainer />
      <Toast />
    </PersistentUser>
  );
};
export default App;
