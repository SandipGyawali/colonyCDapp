import { Extension, Id } from '@colony/colony-js';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';

import ActionButtons from '../partials/ActionButtons.tsx';

import { ExtensionsBadgeMap } from './consts.ts';
import PermissionsNeededBanner from './PermissionsNeededBanner.tsx';

import styles from '../Pages.module.css';

interface ExtensionsTopRowProps {
  extensionData: AnyExtensionData;
  waitingForEnableConfirmation: boolean;
  isSetupRoute: boolean;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionTopRow';

const ExtensionsTopRow: FC<ExtensionsTopRowProps> = ({
  extensionData,
  waitingForEnableConfirmation,
  isSetupRoute,
}) => {
  const { colony } = useColonyContext();

  // @ts-expect-error address will be undefined if the extension hasn't been installed / initialized yet
  const { neededColonyPermissions, address, isInitialized, isDeprecated } =
    extensionData;

  const isVotingReputationExtension =
    extensionData.extensionId === Extension.VotingReputation;

  // If the extension itself doesn't have the correct permissions, show the banner
  const showPermissionsBanner =
    isInitialized &&
    !isDeprecated &&
    !addressHasRoles({
      requiredRolesDomains: [Id.RootDomain],
      colony,
      requiredRoles: neededColonyPermissions,
      address: address || '',
    });

  return (
    <>
      {!isSetupRoute && showPermissionsBanner && (
        <PermissionsNeededBanner extensionData={extensionData} />
      )}
      <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
        <div className={styles.topContainer}>
          <ActionButtons
            waitingForEnableConfirmation={waitingForEnableConfirmation}
            isSetupRoute={isSetupRoute}
            extensionData={extensionData}
            extensionStatusMode={ExtensionsBadgeMap[extensionData.extensionId]}
            extensionStatusText={formatText({
              id: isVotingReputationExtension
                ? 'status.governance'
                : 'status.payments',
            })}
          />
        </div>
      </div>
    </>
  );
};

ExtensionsTopRow.displayName = displayName;

export default ExtensionsTopRow;
