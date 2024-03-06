"use client";

import { Provider as ReduxProvider } from "react-redux";
import { FC, PropsWithChildren } from "react";
import store from "./store";
import { ThemeProvider } from "../utils/ThemeProvider";

export const Provider: FC<PropsWithChildren> = ({ children }) => (
  <ReduxProvider store={store}>
    <ThemeProvider>{children}</ThemeProvider>
  </ReduxProvider>
);
