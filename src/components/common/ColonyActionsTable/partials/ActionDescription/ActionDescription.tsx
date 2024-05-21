import clsx from 'clsx';
import React, { type FC } from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import useShouldDisplayMotionCountdownTime from '~hooks/useShouldDisplayMotionCountdownTime.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/index.ts';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { type ActionDescriptionProps } from './types.ts';

const ActionDescription: FC<ActionDescriptionProps> = ({
  action,
  loading,
  refetchMotionStates,
  hideDetails,
}) => {
  const isMobile = useMobile();
  const {
    initiatorUser: user,
    initiatorAddress,
    metadata,
    isMotion,
    motionData,
    motionState,
    expenditureId,
  } = action;

  const { expenditure, loadingExpenditure } =
    useGetExpenditureData(expenditureId);

  const isLoading = loading || loadingExpenditure;

  const walletAddress = user?.walletAddress || initiatorAddress || ADDRESS_ZERO;
  const refetchMotionState = () => {
    if (!motionData) {
      return;
    }

    refetchMotionStates([motionData.motionId]);
  };

  const { colony } = useColonyContext();
  const shouldShowCounter = useShouldDisplayMotionCountdownTime(
    motionState || null,
  );

  const actionMetadataDescription = formatText(
    { id: 'action.title' },
    getActionTitleValues({
      actionData: action,
      colony,
      expenditureData: expenditure ?? undefined,
    }),
  );

  return (
    <div className="flex w-full items-center gap-2 sm:gap-4">
      {loading ? (
        <div className="h-[26px] w-[26px] rounded-full skeleton before:rounded-full" />
      ) : (
        <UserAvatar
          size={26}
          userAddress={walletAddress}
          userName={user?.profile?.displayName ?? undefined}
          userAvatarSrc={
            user?.profile?.thumbnail ?? user?.profile?.avatar ?? undefined
          }
          className="flex-shrink-0 flex-grow-0"
        />
      )}
      <div className="flex flex-grow flex-col-reverse gap-0.5 md:flex-row md:items-center md:justify-between md:gap-4">
        <div>
          <p
            className={clsx(
              'line-clamp-2 text-md font-medium text-gray-900 md:line-clamp-1',
              {
                skeleton: isLoading,
              },
            )}
          >
            {metadata?.customTitle || actionMetadataDescription || '-'}
          </p>
          {colony && (
            <p
              className={clsx(
                'mt-0.5 line-clamp-2 text-sm font-normal text-gray-600 md:line-clamp-1',
                {
                  skeleton: isLoading,
                  hidden: hideDetails,
                },
              )}
            >
              {isLoading ? '-' : actionMetadataDescription}
            </p>
          )}
        </div>
        {shouldShowCounter &&
          isMotion &&
          motionData &&
          motionState &&
          !isMobile && (
            <MotionCountDownTimer
              className={clsx(
                'flex-shrink-0 text-xs font-medium text-negative-400',
                {
                  hidden: hideDetails,
                },
              )}
              timerClassName="text-negative-400 font-medium text-xs"
              prefix={formatText({
                id: 'activityFeedTable.table.motionCountDown.prefix',
              })}
              motionId={motionData.motionId}
              motionStakes={motionData.motionStakes}
              motionState={motionState}
              refetchMotionState={refetchMotionState}
            />
          )}
      </div>
    </div>
  );
};

export default ActionDescription;
