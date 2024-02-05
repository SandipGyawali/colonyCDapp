import React from 'react';

import { MotionState } from '~utils/colonyMotions.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';

import { type MotionOutcomeBadgeProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.MotionOutcomeBadge';

const MOTION_STATES_TO_SHOW = [
  MotionState.Failed,
  MotionState.Passed,
  MotionState.FailedNotFinalizable,
];

const MotionOutcomeBadge = ({ motionState }: MotionOutcomeBadgeProps) => {
  if (!motionState || !MOTION_STATES_TO_SHOW.includes(motionState)) {
    return null;
  }

  return (
    <div className="ml-auto mr-2">
      <MotionStateBadge state={motionState} />
    </div>
  );
};

MotionOutcomeBadge.displayName = displayName;

export default MotionOutcomeBadge;
