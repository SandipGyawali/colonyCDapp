import { Binoculars } from '@phosphor-icons/react';
import {
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import React, { type FC } from 'react';

import { useMobile } from '~hooks';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';
import CloseButton from '~v5/shared/Button/CloseButton.tsx';

import AcceptButton from '../AcceptButton/index.ts';
import Filter from '../Filter/index.ts';

import { useFundsTable, useFundsTableColumns } from './hooks.tsx';
import { type FundsTableModel } from './types.ts';

const displayName = 'pages.FundsPage.partials.FundsTable';

const FundsTable: FC = () => {
  const columns = useFundsTableColumns();
  const isMobile = useMobile();
  const { filters, searchedTokens, isStatusChanged, defaultStatusFilter } =
    useFundsTable();
  const claims = useColonyFundsClaims();
  const allClaims = Array.from(
    new Set(claims.map((claim) => claim.token?.tokenAddress || '')),
  );

  const activeFilters = filters.items
    .map((item) => {
      const activeItem = filters.value[item.name];

      if (item.name === 'status' && !isStatusChanged) {
        return undefined;
      }

      if (activeItem) {
        const activeFilter = Object.keys(activeItem).filter(
          (key) => activeItem[key],
        );
        const activeFiltersForItem = activeFilter.map((filterKey) => {
          const filter = item.items.find((f) => f.name === filterKey);

          return filter?.symbol || filter?.label;
        });

        return activeFiltersForItem.length > 0
          ? { filterName: item.filterName, filters: activeFiltersForItem }
          : null;
      }

      return undefined;
    })
    .filter(Boolean);

  return (
    <>
      <TableHeader title={formatText({ id: 'incomingFundsPage.table.title' })}>
        <div className="flex items-center gap-2">
          {!isMobile &&
            activeFilters.map((activeFilter) =>
              activeFilter ? (
                <div
                  className="bg-blue-100 py-2 px-3 rounded-lg inline-flex items-center gap-1 text-blue-400"
                  key={activeFilter.filterName}
                >
                  <div className="text-sm font-semibold capitalize container">
                    {activeFilter.filterName}:
                  </div>
                  {activeFilter.filters.map((filter) => (
                    <p className="text-sm min-w-fit" key={filter?.toString()}>
                      {filter}
                      {activeFilter.filters.length > 1 &&
                      activeFilter.filters.indexOf(filter) !==
                        activeFilter.filters.length - 1
                        ? ','
                        : ''}
                    </p>
                  ))}
                  <CloseButton
                    iconSize={12}
                    aria-label={formatText({ id: 'ariaLabel.closeFilter' })}
                    className="shrink-0 text-current ml-1 !p-0"
                    onClick={() => {
                      const filterToRemove = filters.items.find(
                        (item) => item.filterName === activeFilter.filterName,
                      )?.name;

                      if (filterToRemove === 'status') {
                        filters.onChange({
                          ...filters.value,
                          status: defaultStatusFilter,
                        });

                        return;
                      }

                      if (filterToRemove) {
                        const updatedFilters = { ...filters.value };

                        delete updatedFilters[filterToRemove];

                        filters.onChange(updatedFilters);
                      }
                    }}
                  />
                </div>
              ) : null,
            )}
          <Filter {...filters} />
          {claims.length > 0 && (
            <AcceptButton
              tokenAddresses={allClaims}
              disabled={!searchedTokens.length}
            >
              {formatText({ id: 'incomingFundsPage.table.claimAllFunds' })}
            </AcceptButton>
          )}
        </div>
      </TableHeader>
      <Table<FundsTableModel>
        data={searchedTokens}
        columns={columns}
        verticalOnMobile={false}
        hasPagination
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        getFilteredRowModel={getFilteredRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        className="[&_td]:border-b [&_td]:border-gray-100 [&_tr:last-child>td]:border-0 [&_td>div]:p-0 [&_th:last-child]:text-right w-full [&_th:empty]:border-none"
        emptyContent={
          (!searchedTokens.length || claims.length <= 0) && (
            <div className="border w-full rounded-lg border-gray-200">
              <EmptyContent
                title={{ id: 'incomingFundsPage.table.emptyTitle' }}
                description={{ id: 'incomingFundsPage.table.emptyDescription' }}
                icon={Binoculars}
                className="py-[4.25rem]"
              />
            </div>
          )
        }
      />
    </>
  );
};

FundsTable.displayName = displayName;

export default FundsTable;
