import {
  createTheme,
  ThemeProvider as ThemeProviderMaterial,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#e91e63",
    },
    mode: "dark",
  },
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProviderMaterial theme={theme}>{children}</ThemeProviderMaterial>
);
