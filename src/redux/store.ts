import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import authorized from './slices/authorized';
import authentication from './slices/authentication';
import {createEpicMiddleware} from 'redux-observable';
import {RootEpic} from './epic';

const epicMiddleware = createEpicMiddleware();

export const synthetic = configureStore({
  reducer: {
    authorized: authorized,
    authentication: authentication,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(epicMiddleware),

});
  epicMiddleware.run(RootEpic);

export type RootState = ReturnType<typeof synthetic.getState>;
export type AppDispatch = typeof synthetic.dispatch;