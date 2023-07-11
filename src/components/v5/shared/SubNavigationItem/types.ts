import { MessageDescriptor } from 'react-intl';
import { FilterOption } from '~v5/common/Filter/types';
import { FilterType } from '~v5/common/TableFiltering/types';

export type SubNavigationItemProps = {
  iconName: string;
  title: string;
  options?: FilterOption[];
  option?: FilterType;
  shouldBeTooltipVisible?: boolean;
  onClick?: () => void;
  isCopyTriggered?: boolean;
  tooltipText?: string[];
  handleClick?: (option?: string) => void;
  shouldBeActionOnHover?: boolean;
  onSelectNestedOption?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type NestedOptionsProps = {
  selectedOption?: FilterType;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type HeaderProps = {
  title: MessageDescriptor;
};
