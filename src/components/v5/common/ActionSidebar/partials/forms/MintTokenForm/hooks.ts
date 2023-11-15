import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getMintTokenDialogPayload } from '~common/Dialogs/MintTokenDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { MintTokenFormValues, validationSchema } from './consts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

export const useMintToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<MintTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        amount: {
          tokenAddress: colony?.nativeToken.tokenAddress,
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DECISION_METHOD.Permissions
        ? ActionTypes.ACTION_MINT_TOKENS
        : ActionTypes.ROOT_MOTION,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: MintTokenFormValues) => {
          const values = {
            mintAmount: payload.amount.amount,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getMintTokenDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};