"use client";

import { Provider as ReduxProvider } from "react-redux";
import { FC, PropsWithChildren } from "react";
import store from "./store";

export const Provider: FC<PropsWithChildren> = ({ children }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
);
