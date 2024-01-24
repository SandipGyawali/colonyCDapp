import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { MintTokenFormValues } from '../../forms/MintTokenForm/consts';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.MintTokensDescription';

export const MintTokensDescription = () => {
  const formValues = useFormContext<MintTokenFormValues>().getValues();
  const { amount: { amount } = {} } = formValues;
  const {
    colony: { nativeToken },
  } = useColonyContext();

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.MintTokens,
        tokenSymbol: amount
          ? nativeToken.symbol
          : formatText({
              id: 'actionSidebar.metadataDescription.nativeTokens',
            }),
        amount: amount ? (
          <Numeral
            value={moveDecimal(
              amount.toString(),
              getTokenDecimalsWithFallback(nativeToken.decimals),
            )}
            decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
          />
        ) : undefined,
        initiator: <CurrentUser />,
      }}
    />
  );
};

MintTokensDescription.displayName = displayName;
export default MintTokensDescription;
