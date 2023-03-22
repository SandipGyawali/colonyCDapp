import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Id } from '@colony/colony-js';
import { string, object, number, boolean, InferType } from 'yup';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { getDomainOptions } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { WizardDialogType } from '~hooks';
import { toFinite } from '~utils/lodash';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

import TransferFundsDialogForm from './TransferFundsDialogForm';
import { getTransferFundsDialogPayload } from './helpers';

const displayName = 'common.TransferFundsDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  sameDomain: {
    id: `${displayName}.sameDomain`,
    defaultMessage: 'Cannot move to same team pot',
  },
  notEnoughBalance: {
    id: `${displayName}.notEnoughBalance`,
    defaultMessage: 'Insufficient balance in from team pot',
  },
});

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

const TransferFundsDialog = ({
  colony,
  filteredDomainId: selectedDomainId,
  callStep,
  prevStep,
  cancel,
  close,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_MOVE_FUNDS
      : ActionTypes.ACTION_MOVE_FUNDS;

  const colonyDomains = colony?.domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains);
  const colonyBalances = colony.balances?.items?.filter(notNull) || [];

  const transform = pipe(
    mapPayload((payload) => getTransferFundsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  const defaultFromDomainId = selectedDomainId || Id.RootDomain;
  const defaultToDomainId =
    Number(
      domainOptions.find((option) => option.value !== defaultFromDomainId)
        ?.value,
    ) || Id.RootDomain;

  const validationSchema = object()
    .shape({
      forceAction: boolean().defined(),
      fromDomainId: number().required(),
      toDomainId: number()
        .required()
        .when('fromDomainId', (fromDomainId, schema) =>
          schema.notOneOf([fromDomainId], MSG.sameDomain),
        ),
      amount: number()
        .required()
        .transform((value) => toFinite(value))
        .moreThan(0, () => MSG.amountZero)
        .test(
          'not-enough-balance',
          () => MSG.notEnoughBalance,
          (value, context) => {
            if (!value) {
              return true;
            }

            const { fromDomainId, tokenAddress } = context.parent;
            const selectedDomainBalance = colonyBalances.find(
              (balance) =>
                balance.token.tokenAddress === tokenAddress &&
                balance.domain.nativeId === fromDomainId,
            );
            const selectedToken = getSelectedToken(colony, tokenAddress);

            if (!selectedDomainBalance || !selectedToken) {
              return true;
            }

            const tokenDecimals = getTokenDecimalsWithFallback(
              selectedToken.decimals,
            );
            const convertedAmount = BigNumber.from(
              moveDecimal(value, tokenDecimals),
            );

            return convertedAmount.lte(selectedDomainBalance.balance);
          },
        )
        .max(100, () => MSG.notEnoughBalance),
      tokenAddress: string().address().required(),
      annotation: string().max(4000).defined(),
    })
    .defined();

  type FormValues = InferType<typeof validationSchema>;

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          fromDomainId: defaultFromDomainId,
          toDomainId: defaultToDomainId,
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress,
          annotation: '',
          /*
           * @NOTE That since this a root motion, and we don't actually make use
           * of the motion domain selected (it's disabled), we don't need to actually
           * pass the value over to the motion, since it will always be 1
           */
        }}
        validationSchema={validationSchema}
        actionType={actionType}
        onSuccess={close}
        transform={transform}
      >
        {({ watch }) => {
          const forceActionValue = watch('forceAction');
          if (forceActionValue !== isForce) {
            setIsForce(forceActionValue);
          }
          return (
            <TransferFundsDialogForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
