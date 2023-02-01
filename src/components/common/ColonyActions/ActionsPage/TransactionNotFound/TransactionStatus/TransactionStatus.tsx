import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tooltip } from '~shared/Popover';
import { getMainClasses } from '~utils/css';

import styles from './TransactionStatus.css';

const displayName =
  'common.ColonyActions.ActionsPage.TransactionNotFound.TransactionStatus';

const MSG = defineMessages({
  transactionStatus: {
    id: `${displayName}.transactionStatus`,
    defaultMessage: `Transaction {status, select,
        failed {has failed}
        pending {is currently being mined}
        succeeded {succeeded}
        other {status is unknown}
      }`,
  },
});

interface Props {
  status: Status;
  showTooltip?: boolean;
}

export enum Status {
  Failed = 'failed',
  Pending = 'pending',
  Succeeded = 'succeeded',
  SystemMessage = 'systemMessage',
}

const TransactionStatus = ({ status, showTooltip = true }: Props) => (
  <Tooltip
    placement="left"
    trigger={showTooltip ? 'hover' : null}
    content={
      <FormattedMessage {...MSG.transactionStatus} values={{ status }} />
    }
  >
    <div className={styles.main}>
      <span className={getMainClasses({ theme: status }, styles)} />
    </div>
  </Tooltip>
);

TransactionStatus.displayName = displayName;

export default TransactionStatus;
