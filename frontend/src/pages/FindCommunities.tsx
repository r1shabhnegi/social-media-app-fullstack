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
import FindCommunityCard from '@/components/findCommunities/FindCommunityCard';
import Loading from '@/components/Loading';
import { Link } from 'react-router-dom';

const FindCommunities = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useFindCommunitiesQuery(`${page}`);

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
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
                  avatar,
                  description,
                  _id: id,
                  author,
                }: {
                  name: string;
                  avatar: string;
                  description: string;
                  _id: string;
                  author: string;
                },
                index: number
              ) => (
                <Link
                  key={id}
                  to={`/community/${name}`}>
                  <FindCommunityCard
                    name={name}
                    avatar={avatar}
                    description={description}
                    id={id}
                    author={author}
                    index={index + page * 9}
                  />
                </Link>
              )
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
