export type SignupType = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type EditCommunityFormProps = {
  cancel: () => void;
  name: string;
  description: string;
  rules: string;
};

export type postDataType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  authorAvatar: string;
  createdAt: string;
  image: string;
  downVotes: number;
  upVotes: number;
};
