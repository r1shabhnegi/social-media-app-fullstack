import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './Layout';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

const App = () => {
  const auth = true;

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/register'
            element={<Register />}
          />

          <Route
            path='/sign-in'
            element={<SignIn />}
          />

          {auth && (
            <Route
              path='/'
              element={<Home />}
            />
          )}

          <Route
            path='*'
            element={<Home />}
          />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
