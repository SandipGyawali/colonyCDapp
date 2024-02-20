import {
  type ExpenditureDecisionMethod,
  type StreamingPaymentEndCondition,
} from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import {
  type ExpenditurePayoutFieldValue,
  type ExpenditureStageFieldValue,
} from '~types/expenditures.ts';
import {
  type Colony,
  type Domain,
  type Expenditure,
  type ExpenditureSlot,
} from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

import {
  type UniqueActionType,
  type ErrorActionType,
  type MetaWithSetter,
} from './index.ts';

export type ExpenditureFundPayload = {
  colonyAddress: Address;
  fromDomainFundingPotId: number;
  expenditure: Expenditure;
};

export type CancelStakedExpenditurePayload = {
  colonyAddress: Address;
  stakedExpenditureAddress: string;
  shouldPunish: boolean;
  expenditure: Expenditure;
  customActionTitle?: string;
  annotationMessage?: string;
};

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      {
        colony: Colony;
        payouts: ExpenditurePayoutFieldValue[];
        // the domain to create the expenditure in
        createdInDomain: Domain;
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
        networkInverseFee: string;
        decisionMethod: ExpenditureDecisionMethod;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CREATE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_LOCK,
      {
        colonyAddress: Address;
        nativeExpenditureId: number;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_LOCK_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_LOCK_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FINALIZE,
      {
        colony: Colony;
        nativeExpenditureId: number;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FINALIZE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FINALIZE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FUND,
      ExpenditureFundPayload,
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FUND_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FUND_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_EDIT,
      {
        colony: Colony;
        expenditure: Expenditure;
        payouts: ExpenditurePayoutFieldValue[];
        networkInverseFee: string;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_EDIT_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_EDIT_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_DRAFT_CANCEL,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        stakedExpenditureAddress?: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_DRAFT_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_DRAFT_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CLAIM,
      {
        colonyAddress: Address;
        nativeExpenditureId: number;
        claimableSlots: ExpenditureSlot[];
        customActionTitle?: string;
        annotationMessage?: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CLAIM_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CLAIM_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE,
      {
        colony: Colony;
        payouts: ExpenditurePayoutFieldValue[];
        // the domain to create the expenditure in
        createdInDomain: Domain;
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        stakeAmount: string;
        stakedExpenditureAddress: Address;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
        networkInverseFee: string;
        customActionTitle?: string;
        annotationMessage?: string;
        decisionMethod: ExpenditureDecisionMethod;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE,
      {
        colonyAddress: Address;
        nativeExpenditureId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGE,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        slotId: number;
        tokenAddresses: Address[];
        stagedExpenditureAddress: Address;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL,
      CancelStakedExpenditurePayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE,
      {
        colony: Colony;
        createdInDomain: Domain;
        recipientAddress: Address;
        tokenAddress: Address;
        amount: string;
        startTime: number;
        endTime?: number;
        interval: number;
        endCondition: StreamingPaymentEndCondition;
        limitAmount?: string;
        customActionTitle?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STREAMING_PAYMENT_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE_SUCCESS,
      object,
      object
    >;
