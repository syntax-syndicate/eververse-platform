'use client';

import { getFeedbackCompanies } from '@/actions/feedback-organization/list';
import { ItemList } from '@/components/item-list';
import { handleError } from '@repo/design-system/lib/handle-error';
import { formatDate } from '@repo/lib/format';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const FeedbackCompanyList = () => {
  const { data, error, fetchNextPage, isFetching, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['feedbackCompanies'],
      queryFn: async ({ pageParam }) => {
        const response = await getFeedbackCompanies(pageParam);

        if ('error' in response) {
          throw response.error;
        }

        return response.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages, lastPageParameter) =>
        lastPage.length === 0 ? undefined : lastPageParameter + 1,
      getPreviousPageParam: (_firstPage, _allPages, firstPageParameter) =>
        firstPageParameter <= 1 ? undefined : firstPageParameter - 1,
    });

  useEffect(() => {
    if (error) {
      handleError(error.message);
    }
  }, [error]);

  return (
    <ItemList
      data={
        data?.pages.flat().map((item) => ({
          id: item.id,
          href: `/data/companies/${item.id}`,
          title: item.name,
          description: item.domain ?? '',
          caption: formatDate(item.createdAt),
          image: {
            src: `https://logo.clearbit.com/${item.domain}`,
            fallback: item.name,
          },
        })) ?? []
      }
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
    />
  );
};
