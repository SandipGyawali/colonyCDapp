import React, { FC } from 'react';
import WidgetBox from '../WidgetBox';
import { WidgetBoxListProps } from './types';

const displayName = 'v5.common.WidgetBoxList';

const WidgetBoxList: FC<WidgetBoxListProps> = ({ items }) => (
  <ul className="flex sm:flex-row flex-col items-center gap-[1.125rem] w-full">
    {items.map(({ key, ...item }) => (
      <li key={key} className="w-full">
        <WidgetBox {...item} />
      </li>
    ))}
  </ul>
);

WidgetBoxList.displayName = displayName;

export default WidgetBoxList;