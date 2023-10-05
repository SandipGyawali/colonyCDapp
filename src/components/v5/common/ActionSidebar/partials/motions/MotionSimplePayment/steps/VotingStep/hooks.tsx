import { Extension } from '@colony/colony-js';
import * as yup from 'yup';
import { BigNumber } from 'ethers';
import React from 'react';
import { useVotingWidgetUpdate } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VotingWidget';
import { useGetVoterRewardsQuery } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useExtensionData,
  useUserReputation,
} from '~hooks';
import { MotionVotePayload } from '~redux/sagas/motions/voteMotion';
import { InstalledExtensionData } from '~types';
import { mapPayload } from '~utils/actions';
import { DescriptionListItem } from './partials/DescriptionList/types';
import { formatText } from '~utils/intl';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Numeral from '~shared/Numeral';
import { VotingFormValues } from './types';
import { OnSuccess } from '~shared/Fields';

export const useVotingStep = (
  actionData,
  startPollingAction,
  stopPollingAction,
) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { user } = useAppContext();
  const { motionData } = actionData;
  const {
    motionId,
    voterRecord,
    nativeMotionDomainId,
    rootHash,
    repSubmitted,
    skillRep,
  } = motionData;
  const { hasUserVoted, setHasUserVoted } = useVotingWidgetUpdate(
    voterRecord,
    stopPollingAction,
  );
  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress ?? '',
    user?.walletAddress ?? '',
    Number(nativeMotionDomainId),
    rootHash,
  );

  const { extensionData } = useExtensionData(Extension.VotingReputation);

  const maxVoteFraction = (extensionData as InstalledExtensionData)?.params
    ?.votingReputation?.maxVoteFraction;
  const thresholdPercent = BigNumber.from(maxVoteFraction ?? '0')
    .mul(100)
    .div(BigNumber.from(10).pow(18))
    .toNumber();
  const currentReputationPercent = BigNumber.from(repSubmitted)
    .mul(100)
    .div(skillRep)
    .toNumber();

  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
        nativeMotionDomainId,
        motionId,
        rootHash,
      },
    },
    skip: !user || !colony,
    fetchPolicy: 'cache-and-network',
  });
  const { max: maxReward, min: minReward } = data?.getVoterRewards || {};
  const currentUserRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );
  const { vote: currentUserVote } = currentUserRecord || {};

  const transform = mapPayload(
    ({ vote }) =>
      ({
        colonyAddress: colony?.colonyAddress ?? '',
        userAddress: user?.walletAddress,
        vote: Number(vote),
        motionId: BigNumber.from(motionId),
      } as MotionVotePayload),
  );

  const handleSuccess: OnSuccess<VotingFormValues> = (_, { reset }) => {
    setHasUserVoted(true);
    reset();
    startPollingAction(1000);
  };

  const validationSchema = yup
    .object()
    .shape({
      vote: yup.number().required(),
    })
    .defined();

  const items: DescriptionListItem[] = [
    {
      key: '1',
      label: formatText({ id: 'motion.votingStep.votingMethod' }),
      value: formatText({ id: 'motion.votingStep.method' }),
    },
    {
      key: '2',
      label: formatText({ id: 'motion.votingStep.teamReputation' }),
      value: (
        <MemberReputation
          userReputation={userReputation}
          totalReputation={totalReputation}
          textClassName="text-sm"
        />
      ),
    },
    {
      key: '3',
      label: formatText({ id: 'motion.votingStep.rewardRange' }),
      value: (
        <div>
          <Numeral value={minReward || '0'} decimals={nativeToken?.decimals} />
          {' - '}
          <Numeral
            value={maxReward || '0'}
            decimals={nativeToken?.decimals}
            suffix={nativeToken?.symbol}
          />
        </div>
      ),
    },
  ];

  return {
    hasUserVoted,
    currentUserVote,
    thresholdPercent,
    currentReputationPercent,
    transform,
    handleSuccess,
    items,
    validationSchema,
  };
};
