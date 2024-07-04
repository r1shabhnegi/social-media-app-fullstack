import React, { ReactElement } from "react";
import SignIn from "@/pages/SignIn";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import Submit from "@/pages/Submit";
import FindCommunities from "@/pages/FindCommunities";
import CommunityPage from "@/pages/CommunityPage";
import PostDetail from "@/pages/PostDetail";
import ProfilePosts from "@/pages/ProfilePosts";
import ProfileComments from "@/pages/ProfileComments";
import ProfileSaved from "@/pages/ProfileSaved";

export const privateRoutes: { path: string; element: ReactElement }[] = [
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "/community/:name",
    element: React.createElement(CommunityPage),
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
