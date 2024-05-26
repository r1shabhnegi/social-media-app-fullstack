const CommunityDetails = ({
  authorName,
  avatar,
  description,
  name,
  rules,
}: {
  description: string;
  name: string;
  avatar: string;
  authorName: string;
  rules: string[];
}) => {
  return (
    <div className='fixed top-0 left-0 w-full h-screen bg-black bg-opacity-55'></div>
  );
};
export default CommunityDetails;
