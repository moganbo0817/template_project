import React, { createContext, Dispatch, ReactElement, ReactNode, useReducer } from 'react';
import { GlobalStoreBase } from '../model/globalstore';

export type GlobalStoreType = Partial<GlobalStoreBase>;

type GlobalStoreAction =
  | 'LOGIN';

type DispatchGlobalStore = {
  type: GlobalStoreAction;
  payload: GlobalStoreType;
};

const GlobalStore = createContext({
  globalStore: {} as GlobalStoreType,
  dispatchGlobal: {} as Dispatch<DispatchGlobalStore>,
});

export default GlobalStore;

const reducer = (globalStore: GlobalStoreType = {}, action: DispatchGlobalStore): GlobalStoreType => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...globalStore,
        role: action.payload.role,
      };
    default:
      return globalStore;
  }
};

const initialState: GlobalStoreType = {};

type GlobalStoreProviderProps = {
  children?: ReactNode;
};

export const GlobalStoreProvider = (props: GlobalStoreProviderProps): ReactElement => {
  const [globalStore, dispatchGlobal] = useReducer(reducer, initialState);
  const { Provider } = GlobalStore;
  return <Provider value={{ globalStore, dispatchGlobal }}>{props?.children}</Provider>;
};
