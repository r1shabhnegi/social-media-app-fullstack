import React, { ReactElement } from 'react';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import CommunityCreate from './pages/CommunityCreate';

export const publicRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/register',
    element: React.createElement(Register),
  },
  {
    path: '/sign-in',
    element: React.createElement(SignIn),
  },
  {
    path: '/',
    element: React.createElement(Home),
  },
];

export const privateRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/community/create',
    element: React.createElement(CommunityCreate),
  },
];
