import { useFindCommunitiesQuery } from '@/api/queries/communityQuery';
import { useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageLoader from '@/components/PageLoader';

const FindCommunities = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useFindCommunitiesQuery(`${page}`);
  const { userId } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <PageLoader isLoading={isLoading} />;
  }

  return (
    <div className='flex flex-col mx-16'>
      <h1 className='py-5 mb-10 font-bold text-center'>Best of Circlesss</h1>
      <h1 className='font-bold'>Top Communities</h1>
      <p className='text-sm text-[#6f7c71] mb-10'>
        Browse Circlesss’s largest communities
      </p>
      <div className='flex flex-wrap items-center justify-center'>
        {!isLoading
          ? data?.map(
              (
                {
                  name,
                  avatarImg,
                  description,
                  _id: id,
                  authorId,
                }: {
                  name: string;
                  avatarImg: string;
                  description: string;
                  _id: string;
                  authorId: string;
                },
                index: number
              ) => {
                const isMod = authorId === userId;
                return (
                  <Link
                    key={id}
                    to={`/community/${name}`}>
                    <span className='flex items-center gap-4 p-2 mb-16 w-96'>
                      <p>{index + 1}</p>
                      <span className='flex items-center gap-2 p-2 '>
                        <Avatar className=' size-8 sm:size-9'>
                          <AvatarImage
                            src={avatarImg}
                            className='z-0 object-cover'
                          />
                          <AvatarFallback className='bg-gray-600'>
                            {name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          <span className='flex items-center justify-start gap-1 pr-4'>
                            <h2 className='mr-1'>{name}</h2>
                            <p
                              className={`${
                                !isMod && 'hidden'
                              } px-[.2rem] text-xs bg-orange-700 `}>
                              MOD
                            </p>
                          </span>
                          <p className='w-full text-sm text-[#6f7c71] line-clamp-1'>
                            {description}
                          </p>
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              }
            )
          : null}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-hidden='true'
              onClick={() => page > 0 && setPage(page - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#'>{page + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => data.length > 0 && setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
export default FindCommunities;
