import React, { FC } from 'react';
import { FormattedDate } from 'react-intl';

import Numeral from '~shared/Numeral';
import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge';

import { StakeItemProps } from '../types';

import styles from './StakeItem.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({ nativeToken, stake }) => (
  <li className={styles.stakesItem}>
    <div className="relative w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center mr-2 min-w-0">
          {/* @TODO: Replace with action custom title */}
          <p className="text-1 mr-2 truncate min-w-0">{stake.action?.type}</p>
          <span className="text-gray-400 text-xs">
            <FormattedDate value={stake.createdAt} />
          </span>
        </div>
        <UserStakeStatusBadge status={stake.status} />
      </div>
      <div className="flex text-xs">
        <div className="font-medium mr-2">
          <Numeral
            value={stake.amount}
            decimals={nativeToken.decimals}
            suffix={nativeToken.symbol}
          />
        </div>
        {/* @TODO: Replace with action metadata title */}
        <div className="text-gray-600">Pay X 1,000 ETH</div>
      </div>
    </div>
  </li>
);

StakeItem.displayName = displayName;

export default StakeItem;