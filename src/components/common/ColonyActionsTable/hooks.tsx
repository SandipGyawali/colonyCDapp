import { createColumnHelper, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { FilePlus, ArrowSquareOut, ShareNetwork } from 'phosphor-react';

import { generatePath, Link, useNavigate } from 'react-router-dom';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import {
  SearchableColonyActionSortableFields,
  SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import { useActivityFeed, useColonyContext, useMobile } from '~hooks';
import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types';
import { ColonyAction } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl';
import { RenderCellWrapper } from '~v5/common/Table/types';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts';
import TransactionLink from '~shared/TransactionLink';
import { DEFAULT_NETWORK_INFO } from '~constants';

import { makeLoadingRows } from './utils';
import ActionDescription from './partials/ActionDescription';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem';

export const useColonyActionsTableColumns = (
  loading: boolean,
  loadingMotionStates: boolean,
  refetchMotionState: VoidFunction,
) => {
  const isMobile = useMobile();

  return useMemo(() => {
    const helper = createColumnHelper<ActivityFeedColonyAction>();

    return [
      helper.display({
        id: 'description',
        staticSize: isMobile
          ? 'calc(100% - 6.25rem - 3.75rem)'
          : 'calc(100% - 7.8125rem - 10.3125rem - 3.75rem - 6.25rem)',
        header: formatText({
          id: 'activityFeedTable.table.header.description',
        }),
        enableSorting: false,
        cell: ({ row: { original } }) => (
          <ActionDescription
            action={original}
            loading={loading}
            refetchMotionState={refetchMotionState}
          />
        ),
      }),
      helper.display({
        id: 'team',
        staticSize: '7.8125rem',
        header: formatText({
          id: 'activityFeedTable.table.header.team',
        }),
        enableSorting: false,
        cell: ({
          row: {
            original: { motionData, fromDomain },
          },
        }) => {
          const team =
            fromDomain?.metadata || motionData?.motionDomain.metadata;

          return team || loading ? (
            <TeamBadge
              className={clsx({
                skeleton: loading,
              })}
              textClassName="line-clamp-1 break-all"
              teamName={team?.name || '-------'}
            />
          ) : null;
        },
      }),
      helper.accessor('createdAt', {
        staticSize: '10.3125rem',
        header: formatText({
          id: 'activityFeedTable.table.header.date',
        }),
        cell: ({ getValue }) => {
          const date = format(new Date(getValue()), 'dd MMMM yyyy');

          return (
            <span
              className={clsx(
                'font-normal text-md text-gray-600 whitespace-nowrap',
                {
                  skeleton: loading,
                },
              )}
            >
              {date}
            </span>
          );
        },
      }),
      helper.accessor('motionState', {
        staticSize: '6.25rem',
        header: formatText({
          id: 'activityFeedTable.table.header.status',
        }),
        enableSorting: false,
        cell: ({ getValue }) => {
          const motionState = getValue();

          return (
            <MotionStateBadge
              state={motionState || MotionState.Forced}
              className={clsx({ skeleton: loading || loadingMotionStates })}
            />
          );
        },
      }),
    ];
  }, [isMobile, loading, loadingMotionStates, refetchMotionState]);
};

export const useGetColonyActionsTableMenuProps = (loading: boolean) => {
  const navigate = useNavigate();
  const colonyName = useColonyContext().colony?.name || '';

  return useCallback<TableWithMeatballMenuProps<ColonyAction>['getMenuProps']>(
    ({ original: { transactionHash } }) => ({
      disabled: loading,
      items: [
        {
          key: '1',
          label: formatText({ id: 'activityFeedTable.menu.view' }),
          icon: <FilePlus size={16} />,
          onClick: () => {
            navigate(
              `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionHash}`,
              {
                replace: true,
              },
            );
          },
        },
        {
          key: '2',
          label: (
            <TransactionLink
              hash={transactionHash}
              text={{ id: 'activityFeedTable.menu.viewOnNetwork' }}
              textValues={{
                blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
              }}
            />
          ),
          icon: <ArrowSquareOut size={16} />,
        },
        {
          key: '3',
          label: formatText({ id: 'activityFeedTable.menu.share' }),
          renderItemWrapper: (props, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${window.location.origin}${generatePath(
                COLONY_HOME_ROUTE,
                { colonyName },
              )}/${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
              {...props}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          icon: <ShareNetwork size={16} />,
          onClick: () => false,
        },
      ],
    }),
    [colonyName, loading, navigate],
  );
};

export const useActionsTableData = (pageSize: number) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const {
    actions,
    pageNumber,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loadingFirstPage,
    loadingNextPage,
    loadingMotionStates,
    refetchMotionStates,
  } = useActivityFeed(
    useMemo(() => ({}), []),
    useMemo(() => {
      const validSortValues = sorting?.reduce<
        SearchableColonyActionSortInput[]
      >((result, { desc, id }) => {
        try {
          const sortColumn = getEnumValueFromKey(
            SearchableColonyActionSortableFields,
            id,
          );

          return [
            ...result,
            {
              field: sortColumn,
              direction: desc
                ? SearchableSortDirection.Desc
                : SearchableSortDirection.Asc,
            },
          ];
        } catch {
          return result;
        }
      }, []);

      if (!validSortValues || !validSortValues.length) {
        return undefined;
      }

      return validSortValues;
    }, [sorting]),
    {
      pageSize,
    },
  );
  const loading = loadingFirstPage || loadingNextPage;

  return {
    pageNumber,
    refetchMotionStates,
    loadingMotionStates,
    data: loading ? makeLoadingRows(pageSize) : actions,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loading,
    sorting,
    setSorting,
  };
};

export const useRenderRowLink =
  (): RenderCellWrapper<ActivityFeedColonyAction> => {
    return (className, content, { cell, row, renderDefault }) =>
      cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID ? (
        renderDefault()
      ) : (
        <Link
          className={clsx(className, '!py-[.5625rem]')}
          to={`?${TX_SEARCH_PARAM}=${row.original.transactionHash}`}
        >
          {content}
        </Link>
      );
  };