import { AppDispatch, RootState } from "@/global/_store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageLoader from "@/components/PageLoader";

import { IoAdd } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  useGetCommunityQuery,
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "@/api/queries/communityQuery";
import { TbListDetails } from "react-icons/tb";
import { MdEditNote } from "react-icons/md";
import { useState } from "react";
import { showToast } from "@/global/toastSlice";
import { MdOutlineCancel } from "react-icons/md";

import EditCommunityForm from "@/components/EditCommunityForm";
import CommunityPosts from "@/components/CommunityPosts";
import CommunityRightSideBar from "@/components/CommunityRightSideBar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Community = () => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { name: communityName } = useParams();
  const { userId } = useSelector((state: RootState) => state.auth);

  const { userCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  const { data: communityData, isLoading: communityLoading } =
    useGetCommunityQuery(communityName);

  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const [deleteCommunity] = useDeleteCommunityMutation();

  const isMod = userId === communityData?.authorId;

  const joined = userCommunitiesList.filter(
    ({ ...elem }: { name: string; _id: string }) => elem.name === communityName
  );
  const isNotJoined = joined.length !== 0;

  const handleJoinCommunity = async () => {
    if (!isNotJoined) {
      await joinCommunity({ communityName, userId });
    }
    if (isNotJoined) {
      await leaveCommunity({ communityName, userId });
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const res = await deleteCommunity({ communityName }).unwrap();
      if (res) {
        navigate("/");
        dispatch(
          showToast({
            message: "Community Deleted Successfully!",
            type: "SUCCESS",
          })
        );
      }
    } catch (error) {
      showToast({
        message: "Failed Deleting Community!",
        type: "ERROR",
      });
    }
  };

  if (communityLoading) return <PageLoader isLoading={communityLoading} />;

  return (
    <div className='flex max-w-[65rem] mx-auto flex-col'>
      <div className=' sm:p-2'>
        {communityData?.coverImg ? (
          <img
            src={communityData?.coverImg}
            alt='coverImg'
            className='object-cover w-full mx-auto bg-gray-500 h-14 sm:h-20 md:h-32 sm:rounded-md'
          />
        ) : (
          <div className='w-full mx-auto bg-gray-500 h-14 sm:h-20 md:h-32 sm:rounded-md'></div>
        )}
      </div>

      <div className='flex flex-col items-start justify-between h-24 gap-5 px-3 mx-1 -mt-6 md:-mt-12 md:mx-0 md:items-end md:flex-row'>
        <span className='flex items-end gap-4'>
          <Avatar className='size-[4rem] sm:size-[5.4rem] border-4 border-[#0b1416]'>
            <AvatarImage
              className='object-cover'
              src={communityData?.avatarImg}
            />
            <AvatarFallback className='bg-gray-700'>RN</AvatarFallback>
          </Avatar>
          <h1 className='text-2xl font-bold sm:text-3xl md:text-3xl lg:text-4xl'>
            r/{communityName}
          </h1>
        </span>

        <span className='flex gap-4'>
          <button
            className='flex items-center justify-between gap-1 text-sm font-bold border-gray-400 rounded-full sm:px-3 sm:py-2 sm:border lg:text-base hover:border-gray-100'
            onClick={() => navigate("/submit", { state: { communityName } })}>
            <IoAdd className='size-5 md:size-7 ' />
            Create a post
          </button>

          <button
            className='flex items-center justify-between gap-2 text-sm font-bold border-gray-400 rounded-full sm:border sm:px-3 sm:py-2 lg:text-base lg:hidden hover:border-gray-100'
            onClick={() => setDetailModal(!detailModal)}>
            <TbListDetails className='size-4 md:size-5' />
            details
          </button>

          {isMod && (
            <button
              className='flex items-center justify-between gap-1 text-sm font-bold border-gray-400 rounded-full sm:px-3 sm:py-2 sm:border lg:text-base hover:border-gray-100'
              onClick={() => setEditModal(!editModal)}>
              <MdEditNote className='size-5 md:size-7 ' />
              Edit
            </button>
          )}

          <button
            className={`${isMod && "hidden"} ${
              isNotJoined
                ? "bg-[#898989] hover:bg-[#626262]"
                : "bg-[#0045ac] hover:bg-[#0079d3]"
            }  rounded-full font-bold py-1 px-2 sm:py-2 sm:px-3`}
            onClick={handleJoinCommunity}>
            {isNotJoined ? "Leave" : "Join"}
          </button>

          {/* Drop down */}
          {isMod && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className={`${
                    !isMod && "hidden"
                  } flex items-center hover:bg-transparent ring-0 focus:ring-0 hover:text-white justify-center sm:border border-gray-400 rounded-full sm:size-11 hover:border-gray-100`}>
                  <RxDotsHorizontal className=' hover:text-white size-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='border-0 ring-0 focus:ring-0 w-56 mt-5 text-gray-200 bg-[#213036] rounded-2xl'
                align='end'>
                <DropdownMenuItem
                  className='cursor-pointer rounded-xl'
                  onClick={handleDeleteCommunity}>
                  <MdOutlineDeleteOutline className='mr-2 size-6' />
                  <span>Delete Community</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </span>
      </div>

      <div className='flex mt-20 md:mt-10 xl:gap-20'>
        <CommunityPosts
          communityId={communityData?._id}
          communityName={communityName}
        />
        <div className='hidden mt-5 mr-4 lg:block xl:mt-0 xl:w-80 lg:w-72'>
          <CommunityRightSideBar
            authorName={communityData?.authorName}
            avatar={communityData?.avatar}
            description={communityData?.description}
            name={communityData?.name}
            rules={communityData?.rules}
          />
        </div>
      </div>
      {editModal && (
        <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-[#0f1a1c] mx-10 p-6 rounded-3xl max-w-[60rem] w-full'>
            <div className='flex justify-between'>
              <h1 className='px-1 mb-8 text-xl font-semibold text-center md:text-3xl '>
                Edit Community
              </h1>
              <span
                className='cursor-pointer top-10 right-10'
                onClick={() => setEditModal(!editModal)}>
                <MdOutlineCancel size={25} />
              </span>
            </div>
            <EditCommunityForm
              cancel={() => setEditModal(!editModal)}
              name={communityData?.name}
              description={communityData?.description}
              rules={communityData?.rules}
            />
          </div>
        </div>
      )}
      {detailModal && (
        <div className='fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50'>
          <div className='mx-3 w-72 sm:w-80 md:w-96 p-5 rounded-2xl bg-[#162226]'>
            <span className='flex items-end justify-between mb-3'>
              <h1 className='font-semibold text-md'>Create a community</h1>
              <MdOutlineCancel
                className='cursor-pointer size-5 sm:size-7'
                onClick={() => setDetailModal(!detailModal)}
              />
            </span>
            <CommunityRightSideBar
              authorName={communityData?.authorName}
              avatar={communityData?.avatar}
              description={communityData?.description}
              name={communityData?.name}
              rules={communityData?.rules}
            />
            <div className='flex justify-end gap-5 mt-3'>
              <button
                className='px-5 text-center w-full py-3 bg-[#223237] rounded-2xl'
                type='button'
                onClick={() => setDetailModal(!detailModal)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Community;
