import React, { ReactElement } from 'react';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import CommunityCreate from './pages/CommunityCreate';
import PostCreate from './pages/PostCreate';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

export const publicRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/',
    element: React.createElement(Home),
  },
  {
    path: '/sign-up',
    element: React.createElement(SignUp),
  },
  {
    path: '/sign-in',
    element: React.createElement(SignIn),
  },
];

export const privateRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/create/community',
    element: React.createElement(CommunityCreate),
  },
  {
    path: '/create/post/',
    element: React.createElement(PostCreate),
  },
  {
    path: '/profile/:username',
    element: React.createElement(Profile),
  },
];
