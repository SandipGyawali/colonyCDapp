import { AccordionItemProps } from './partials/AccordionItem/types';

export interface AccordionItem extends Omit<AccordionItemProps, 'className'> {
  key: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  openedItemIndex?: number;
  className?: string;
  itemClassName?: string;
}
