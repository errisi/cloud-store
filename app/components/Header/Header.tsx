"use client";

import Link from "next/link";
import styles from "./Header.module.scss";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Input,
  ButtonGroup,
  Button,
  TextField,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { ThemeProvider } from "@/app/utils/ThemeProvider";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import * as UserActions from "@/app/store/reducers/User";
import { authService } from "@/app/services/client/authService";
import { Auth } from "./Auth/Auth";

export const Header = () => {
  const dispatch = useAppDispatch();
  const [isAuthMenuOpened, setIsAuthMenuOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const { user, error } = useAppSelector((state) => state.User);

  const handleAuthMenuOpen = () => {
    setIsAuthMenuOpened(true);
  };

  const handleRegister = async (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await authService.register(email, password);

      await dispatch(UserActions.init({ email, password }));
      dispatch(UserActions.checkAuth());
      setIsAuthMenuOpened(false);
      setRegisterError("");
    } catch (error) {
      setRegisterError(`${(error as any).response.data.message}`);
    }
  };

  const handleAuth = async (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const result = await dispatch(UserActions.init({ email, password }));

    if (!(result as any).error) {
      setIsAuthMenuOpened(false);
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image src="./logo.svg" alt="logo" width={44} height={44} />
      </Link>
      {!!user && (
        <h2 className={styles.header__search}>
          <ThemeProvider>
            <FormControl
              size="small"
              fullWidth
              className={styles.header__search}
            >
              <OutlinedInput
                id="standard-adornment-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ThemeProvider>
        </h2>
      )}
      <nav className={styles.nav}>
        <ul className={styles.nav__list}>
          <li>
            <ThemeProvider>
              {!!user && (
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              )}

              {!user && (
                <Button variant="contained" onClick={handleAuthMenuOpen}>
                  Authorization
                </Button>
              )}
            </ThemeProvider>
          </li>
        </ul>
      </nav>

      {isAuthMenuOpened && (
        <Auth
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          error={error || registerError}
          setIsAuthMenuOpened={setIsAuthMenuOpened}
          handleAuth={handleAuth}
          handleRegister={handleRegister}
        />
      )}
    </header>
  );
};
