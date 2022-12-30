import React, { createContext, Dispatch, ReactElement, ReactNode, useReducer } from 'react';
import { GlobalStoreBase } from '../model/globalstore';

export type GlobalStoreType = Partial<GlobalStoreBase>;

type GlobalStoreAction =
  | 'LOGIN';

type DispatchGlobalStore = {
  type: GlobalStoreAction;
  payload: GlobalStoreType;
};

/** グローバルステート
React.Context と useReducer で実現しています

@return {Context} GlobalStore

使い方の例

```
import GlobalStore from 'utils/GlobalStore';
const { globalStore, dispatchGlobal } = useContext(GlobalStore);
// 読み取り
console.log(globalStore.current);
// 更新
dispatch({
  type: 'LOAD_SOMETHING'
  payload: {
    content: 'hello someone!!'
  }
})
```
*/
const GlobalStore = createContext({
  globalStore: {} as GlobalStoreType,
  dispatchGlobal: {} as Dispatch<DispatchGlobalStore>,
});

export default GlobalStore;

const reducer = (globalStore: GlobalStoreType = {}, action: DispatchGlobalStore): GlobalStoreType => {
  switch (action.type) {
    // action を追加する場合、 GlobalStoreAction のエイリアスにも追加してください
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
