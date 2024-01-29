import {
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import React, { type FC } from 'react';

import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader/index.ts';

import AcceptButton from '../AcceptButton/index.ts';
import Filter from '../Filter/index.ts';

import { useFundsTable, useFundsTableColumns } from './hooks.tsx';
import { type FundsTableModel } from './types.ts';

const displayName = 'pages.FundsPage.partials.FundsTable';

const FundsTable: FC = () => {
  const columns = useFundsTableColumns();
  const { filters, searchedTokens } = useFundsTable();
  const claims = useColonyFundsClaims();
  const allClaims = Array.from(
    new Set(claims.map((claim) => claim.token?.tokenAddress || '')),
  );

  return (
    <TableWithActionsHeader<FundsTableModel>
      tableProps={{
        data: searchedTokens,
        columns,
        verticalOnMobile: false,
        hasPagination: true,
        initialState: {
          pagination: {
            pageSize: 10,
          },
        },
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        className:
          '[&_td]:border-b [&_td]:border-gray-100 [&_tr:last-child>td]:border-0 [&_td>div]:p-0 [&_th:last-child]:text-right w-full [&_th:empty]:border-none',
      }}
      title={formatText({ id: 'incomingFundsPage.table.title' })}
      emptyContent={
        (!searchedTokens.length || claims.length <= 0) && (
          <div className="border w-full rounded-lg border-gray-200">
            <EmptyContent
              title={{ id: 'incomingFundsPage.table.emptyTitle' }}
              description={{ id: 'incomingFundsPage.table.emptyDescription' }}
              icon="binoculars"
              className="py-[4.25rem]"
            />
          </div>
        )
      }
    >
      <div className="flex items-center gap-2">
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
    </TableWithActionsHeader>
  );
};

FundsTable.displayName = displayName;

export default FundsTable;
