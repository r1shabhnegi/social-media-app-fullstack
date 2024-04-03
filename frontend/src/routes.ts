import React, { ReactElement } from 'react';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Submit from './pages/Submit';
import FindCommunities from './pages/FindCommunities';
import communityPage from './pages/CommunityPage';

export const publicRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/',
    element: React.createElement(Home),
  },
  {
    path: '/communities',
    element: React.createElement(FindCommunities),
  },
  {
    path: '/',
    element: React.createElement(Home),
  },
];

export const privateRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/profile/:username',
    element: React.createElement(Profile),
  },
  {
    path: '/community/:name',
    element: React.createElement(communityPage),
  },
];

export const independentPageRoutes: { path: string; element: ReactElement }[] =
  [
    {
      path: '/sign-up',
      element: React.createElement(SignUp),
    },
    {
      path: '/sign-in',
      element: React.createElement(SignIn),
    },
  ];

export const privateIndependentPageRoutes: {
  path: string;
  element: ReactElement;
}[] = [
  {
    path: '/submit',
    element: React.createElement(Submit),
  },
];
