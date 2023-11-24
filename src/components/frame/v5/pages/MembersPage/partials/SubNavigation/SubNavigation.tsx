import React, { FC } from 'react';

import { useActionSidebarContext } from '~context';
import { ACTION } from '~constants/actions';
import { formatText } from '~utils/intl';
import SubNavigationItem from '~v5/shared/SubNavigationItem';
import { useMembersSubNavigation } from '~v5/shared/SubNavigationItem/hooks';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { SubNavigationProps } from './types';

const displayName = 'v5.pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({ onManageMembersClick }) => {
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return (
    <ul>
      <SubNavigationItem
        iconName="share-network"
        title="members.subnav.invite"
        shouldBeTooltipVisible
        tooltipText={formatText({ id: 'linkCopied' })}
        onClick={handleClick}
        isCopyTriggered={isCopyTriggered}
      />
      <SubNavigationItem
        iconName="lock-key"
        title="members.subnav.permissions"
        onClick={() =>
          toggleActionSidebarOn({
            [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
          })
        }
      />
      <SubNavigationItem
        iconName="pencil"
        title="members.subnav.manage"
        onClick={onManageMembersClick}
      />
      {/* Action not ready yet */}
      {/* <SubNavigationItem
        iconName="address-book"
        title="members.subnav.verified"
      /> */}
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
