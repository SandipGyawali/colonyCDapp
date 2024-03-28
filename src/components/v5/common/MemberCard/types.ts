import { type UserRoleMeta } from '~constants/permissions.ts';
import { type ContributorType } from '~gql';
import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface MemberCardProps {
  userAddress: string;
  user?: User;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isVerified?: boolean;
  contributorType?: ContributorType;
}

export interface SimpleMemberCardProps {
  userAddress: string;
  user?: User;
  meatBallMenuProps: MeatBallMenuProps;
}
