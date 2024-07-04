import { useServerStatusQuery } from "./api/queries/authQuery";
import Error from "./components/Error";
import PagesContainer from "./PagesContainer";
import Toast from "./components/Toast";
import PersistentUser from "./PersistentUser";
import PageLoader from "./components/PageLoader";

const App = () => {
  const { isError, isLoading } = useServerStatusQuery({});

  if (isLoading || isError) {
    isLoading ? (
      <PageLoader isLoading={isLoading} />
    ) : (
      <Error error={"Server Is Down"} />
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
