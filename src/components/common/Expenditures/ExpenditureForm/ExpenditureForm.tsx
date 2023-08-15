import React from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import { Expenditure } from '~types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';

import ExpenditureFormFields from './ExpenditureFormFields';
import {
  getExpenditurePayoutsFieldValue,
  getInitialPayoutFieldValue,
} from './helpers';
import { ExpenditurePayoutFieldValue } from './types';

export interface ExpenditureFormValues {
  payouts: ExpenditurePayoutFieldValue[];
}

export interface ExpenditureFormProps {
  expenditure?: Expenditure;
  submitButtonText?: string;
  showCancelButton?: boolean;
  onCancelClick?: () => void;
  onSuccess?: () => void;
}

const ExpenditureForm = ({
  expenditure,
  onSuccess,
  ...props
}: ExpenditureFormProps) => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const transformCreateExpenditurePayload = pipe(
    mapPayload((payload: ExpenditureFormValues) => ({
      colony,
      payouts: payload.payouts,
      // @TODO: These should come from the form values
      domainId: Id.RootDomain,
      fundFromDomainId: Id.RootDomain,
    })),
    withMeta({ navigate }),
  );

  const transformEditExpenditurePayload = pipe(
    mapPayload((payload: ExpenditureFormValues) => ({
      colonyAddress: colony.colonyAddress,
      expenditure,
      payouts: payload.payouts,
    })),
    withMeta({}),
  );

  const isEditing = !!expenditure;

  return (
    <ActionForm
      defaultValues={{
        payouts: expenditure
          ? getExpenditurePayoutsFieldValue(expenditure)
          : [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      actionType={
        isEditing
          ? ActionTypes.EXPENDITURE_EDIT
          : ActionTypes.EXPENDITURE_CREATE
      }
      transform={
        isEditing
          ? transformEditExpenditurePayload
          : transformCreateExpenditurePayload
      }
      onSuccess={onSuccess}
    >
      <ExpenditureFormFields {...props} colony={colony} />
    </ActionForm>
  );
};

export default ExpenditureForm;
