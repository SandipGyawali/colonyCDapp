import React, { type FC, useMemo } from 'react';

import ExtensionItem from '~common/Extensions/ExtensionItem/index.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'frame.Extensions.pages.ExtensionsPage';

const ExtensionsPage: FC = () => {
  const { availableExtensionsData, installedExtensionsData } =
    useExtensionsData();

  useSetPageHeadingTitle(formatText({ id: 'extensionsPage.title' }));

  const allExtensions: AnyExtensionData[] = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  const categorizedExtensions: Record<string, AnyExtensionData[]> =
    allExtensions.reduce((acc, extension) => {
      if (!acc[extension.category]) {
        acc[extension.category] = [];
      }

      acc[extension.category].push(extension);

      return acc;
    }, {});

  return (
    <div>
      <h2 className="heading-4 mb-6">
        {formatText({ id: 'extensionsPage.availableExtensions' })}
      </h2>
      {Object.entries(categorizedExtensions).map(([category, extensions]) => (
        <div
          key={category}
          className="border-b border-gray-100 last:border-none mb-6 last:mb-0"
        >
          <h3 className="text-2 mb-4">{category}</h3>
          <ul className="flex flex-col gap-y-6 pb-6">
            {extensions.map((extension) => (
              <li key={extension.extensionId} className="pb-2">
                <ExtensionItem
                  title={extension.name}
                  description={extension.descriptionShort}
                  version={
                    'currentVersion' in extension
                      ? extension.currentVersion
                      : extension.availableVersion
                  }
                  icon={extension.icon}
                  extensionId={extension.extensionId}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

ExtensionsPage.displayName = displayName;

export default ExtensionsPage;
