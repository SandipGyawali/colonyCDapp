import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useHover } from '~hooks/useHover';
import Icon from '~shared/Icon';
import { PopoverButtonProps } from './types';

const displayName = 'Extensions.PopoverButton';

const PopoverButton: FC<PopoverButtonProps> = ({
  isDisabled,
  isFullWidth,
  type,
}) => {
  const { formatMessage } = useIntl();
  const { isHovered, toggleHover } = useHover();
  const iconName =
    (type === 'view' && 'eye') ||
    (type === 'deposit' && 'arrow-circle-down-right') ||
    'arrow-circle-up-right';

  const typeText =
    typeof type === 'string' ? type : type && formatMessage(type);

  return (
    <button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.showDetails' })}
      className={clsx(
        `flex items-center bg-base-white rounded-sm capitalize border text-4 px-2 py-1 transition-all duration-normal`,
        {
          'border border-gray-300 cursor-not-allowed text-gray-300': isDisabled,
          'text-blue-400 border-blue-400': isHovered && !isDisabled,
          'border-gray-100 text-gray-700': !isHovered,
          'w-full justify-center': isFullWidth,
        },
      )}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
    >
      <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
      <span className="ml-1">{typeText}</span>
    </button>
  );
};

PopoverButton.displayName = displayName;

export default PopoverButton;
