import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { ContributorType } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';

import ContributorTypeWrapper from '../ContributorTypeWrapper/ContributorTypeWrapper.tsx';
import { UserAvatar2 } from '../UserAvatar/UserAvatar.tsx';

import { type UserDetailsProps } from './types.ts';

const displayName = 'v5.UserDetails';

const getUserStatusMode = (
  contributorType: ContributorType,
): UserStatusMode => {
  switch (contributorType) {
    case ContributorType.New:
      return 'active-new';
    case ContributorType.Active:
      return 'active-filled';
    case ContributorType.Dedicated:
      return 'dedicated-filled';
    case ContributorType.Top:
      return 'top-filled';
    default:
      return 'general';
  }
};

const UserDetails: FC<UserDetailsProps> = ({
  userName,
  walletAddress,
  contributorType,
  isVerified,
  userAvatarSrc,
  size,
}) => {
  const userStatus = contributorType
    ? getUserStatusMode(contributorType)
    : undefined;

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
      {isVerified ? (
        <UserAvatar2
          size={size}
          userAvatarSrc={userAvatarSrc}
          userName={userName ?? undefined}
          userAddress={walletAddress}
        />
      ) : (
        <div className="flex relative justify-center">
          <ContributorTypeWrapper
            contributorType={contributorType || ContributorType.General}
          >
            <UserAvatar2
              size={size}
              userAvatarSrc={userAvatarSrc}
              userName={userName ?? undefined}
              userAddress={walletAddress}
            />
          </ContributorTypeWrapper>
          {!!userStatus && userStatus !== 'general' && (
            <span className="absolute bottom-[-0.9375rem]">
              <UserStatus
                mode={userStatus}
                text={formatText({ id: userStatus })}
                pillSize="small"
              />
            </span>
          )}
        </div>
      )}
      <div>
        <div className="mb-0.5 grid grid-cols-[auto,1fr] items-center gap-x-2">
          <p className="truncate heading-4">{userName || walletAddress}</p>
          {isVerified && (
            <span className="flex shrink-0 text-blue-400">
              <SealCheck size={14} />
            </span>
          )}
        </div>
        <div className="py-1">
          {walletAddress && <CopyableAddress address={walletAddress} />}
        </div>
      </div>
    </div>
  );
};

UserDetails.displayName = displayName;

export default UserDetails;
