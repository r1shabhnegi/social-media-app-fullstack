import React, { ReactElement, lazy } from "react";

import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

const Submit = lazy(() => import("@/pages/Submit"));
const FindCommunities = lazy(() => import("@/pages/FindCommunities"));
const PostDetail = lazy(() => import("@/pages/PostDetail"));
const ProfilePosts = lazy(() => import("@/pages/ProfilePosts"));
const ProfileComments = lazy(() => import("@/pages/ProfileComments"));
const ProfileSaved = lazy(() => import("@/pages/ProfileSaved"));
const Community = lazy(() => import("@/pages/Community"));
const CommunitiesFeed = lazy(() => import("@/pages/CommunitiesFeed"));

export const privateRoutes: { path: string; element: ReactElement }[] = [
  {
    path: "/community/:name",
    element: React.createElement(Community),
  },
  {
    path: "/submit",
    element: React.createElement(Submit),
  },
  {
    path: "/*",
    element: React.createElement(Home),
  },
  {
    path: "/communities",
    element: React.createElement(FindCommunities),
  },
  {
    path: "/post/:id",
    element: React.createElement(PostDetail),
  },
];

export const independentPageRoutes: { path: string; element: ReactElement }[] =
  [
    {
      path: "/sign-up",
      element: React.createElement(SignUp),
    },
    {
      path: "/sign-in",
      element: React.createElement(SignIn),
    },
  ];

export const profileRoutes: { path: string; element: ReactElement }[] = [
  {
    path: "/profile/:username/posts",
    element: React.createElement(ProfilePosts),
  },
  {
    path: "/profile/:username/comments",
    element: React.createElement(ProfileComments),
  },
  {
    path: "/profile/:username/saved",
    element: React.createElement(ProfileSaved),
  },
];

export const homeRoutes: { path: string; element: ReactElement }[] = [
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "/following-feed",
    element: React.createElement(CommunitiesFeed),
  },
];
