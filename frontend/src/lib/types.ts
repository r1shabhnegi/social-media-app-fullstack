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
