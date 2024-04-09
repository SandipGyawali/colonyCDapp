import { type EmptyContentProps } from '~v5/common/EmptyContent/types.ts';
import { type TextButtonProps } from '~v5/shared/Button/types.ts';

import { type MemberItem } from '../../types.ts';

export interface MembersTabContentProps {
  items: MemberItem[];
  withSimpleCards?: boolean;
  isLoading?: boolean;
  loadMoreButtonProps?: TextButtonProps;
  contentClassName?: string;
  emptyContentProps?: EmptyContentProps;
}

export interface MembersTabContentWrapperProps {
  title: string;
  titleAction?: React.ReactNode;
  description: string;
  additionalActions?: React.ReactNode;
}
