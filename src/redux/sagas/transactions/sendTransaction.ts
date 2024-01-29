import { ClientType } from '@colony/colony-js';
import { Contract, type ContractInterface } from 'ethers';
import { call, put, take } from 'redux-saga/effects';
// import abis from '@colony/colony-js/lib-esm/abis';

import { TransactionStatus } from '~gql';
import {
  TRANSACTION_METHODS,
  ExtendedClientType,
} from '~types/transactions.ts';
import { mergePayload } from '~utils/actions.ts';

import { transactionSendError } from '../../actionCreators/index.ts';
import { type ActionTypes } from '../../actionTypes.ts';
import { type TransactionRecord } from '../../immutable/index.ts';
import { oneTransaction } from '../../selectors/index.ts';
import { type Action } from '../../types/actions/index.ts';
import { selectAsJS, getColonyManager } from '../utils/index.ts';

import getMetatransactionPromise from './getMetatransactionPromise.ts';
import getTransactionPromise from './getTransactionPromise.ts';
import transactionChannel from './transactionChannel.ts';

/*
 * @TODO Refactor to support abis (either added to the app or from colonyJS)
 */
const abis = {
  WrappedToken: { default: { abi: {} as ContractInterface } },
  vestingSimple: { default: { abi: {} as ContractInterface } },
};

export default function* sendTransaction({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_SEND>) {
  const transaction: TransactionRecord = yield selectAsJS(oneTransaction, id);

  const { status, context, identifier, metatransaction, methodName } =
    transaction;

  if (status !== TransactionStatus.Ready) {
    throw new Error('Transaction is not ready to send.');
  }
  const colonyManager = yield getColonyManager();

  let contextClient: any; // Disregard the `any`. The new ColonyJS messed up all the types
  if (context === ClientType.TokenClient) {
    contextClient = yield colonyManager.getTokenClient(identifier as string);
  } else if (context === ClientType.TokenLockingClient) {
    contextClient = yield colonyManager.getTokenLockingClient(
      identifier as string,
    );
  } else if (
    metatransaction &&
    methodName === TRANSACTION_METHODS.DeployTokenAuthority
  ) {
    contextClient = colonyManager.networkClient;
  } else if (context === ExtendedClientType.WrappedTokenClient) {
    const wrappedTokenAbi = abis.WrappedToken.default.abi;
    contextClient = new Contract(
      identifier || '',
      wrappedTokenAbi,
      colonyManager.signer,
    );
    contextClient.clientType = ExtendedClientType.WrappedTokenClient;
  } else if (context === ExtendedClientType.VestingSimpleClient) {
    const vestingSimpleAbi = abis.vestingSimple.default.abi;
    contextClient = new Contract(
      identifier || '',
      vestingSimpleAbi,
      colonyManager.signer,
    );
    contextClient.clientType = ExtendedClientType.VestingSimpleClient;
  } else {
    contextClient = yield colonyManager.getClient(
      context as ClientType,
      identifier,
    );
  }

  if (!contextClient) {
    throw new Error('Context client failed to instantiate');
  }

  const promiseMethod = metatransaction
    ? getMetatransactionPromise
    : getTransactionPromise;

  /*
   * @NOTE Create a promise to send the transaction with the given method.
   *
   * DO NOT! yield this method! Otherwise the error we're throwing inside
   * `getMetatransactionMethodPromise` based on the broadcaster's response message
   * will not catch, so the UI will not properly display it in the Gas Station
   */
  const txPromise = promiseMethod(contextClient, transaction);

  const channel = yield call(
    transactionChannel,
    txPromise,
    transaction,
    contextClient,
  );

  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const currentTransaction = yield selectAsJS(oneTransaction, id);

      // Put the action to the store
      yield put(mergePayload({ transaction: currentTransaction })(action));
    }
  } catch (error) {
    console.error(error);
    yield put(transactionSendError(id, error));
  } finally {
    channel.close();
  }
}
