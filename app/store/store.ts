import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/User";
import FoldersReducer from "./reducers/Folders";

const store = configureStore({
  reducer: {
    User: UserReducer,
    Folders: FoldersReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
