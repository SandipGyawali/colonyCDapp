/// <reference types="@types/webpack-env" />
/* eslint-disable import/no-import-module-exports */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import { Logger } from 'ethers/lib.esm/utils';
import Decimal from 'decimal.js';

import './styles/main.global.css';

import '~utils/yup/customMethods'; // ensures custom yup methods are available when components load
import Entry from './Entry';
import store from '~redux/createReduxStore';

Decimal.set({ toExpPos: 78 });

Logger.setLogLevel(Logger.levels.ERROR);

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = createRoot(rootNode);
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));

  if (module.hot) {
    module.hot.accept();
  }
}
