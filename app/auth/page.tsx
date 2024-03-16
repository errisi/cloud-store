"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
  ButtonGroup,
  Button,
  TextField,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { FC, FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as UserActions from "@/app/store/reducers/User";
import { authService } from "@/app/services/client/authService";
import { useRouter } from 'next/navigation';

const Auth: FC = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { error } = useAppSelector((state) => state.User);

  const { push } = useRouter();

  const handleRegister = async (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await authService.register(email, password);

      await dispatch(UserActions.init({ email, password }));
      dispatch(UserActions.checkAuth());
      setRegisterError("");
      push('/');
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
      push('/');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const re = new RegExp(
      `^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$`,
      "i"
    );

    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError("Wrong Email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);

    if (e.target.value.length < 8) {
      setPasswordError("Password must be longer than 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleOnBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    switch (e.target.name) {
      case "email":
        if (!email) {
          setEmailError("Email cannot be empty");
        }

        break;

      case "password":
        if (!password) {
          setPasswordError("Password cannot be empty");
        }

        break;

      default:
        break;
    }
  };

  const handleClickShowPassword = () => setShowPassword((c) => !c);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.header__auth}>
        <form
          className={styles.header__auth__form}
          onSubmit={(e) => handleAuth(e)}
        >
          <h2 className={styles.header__auth__title}>Authorization</h2>
          {error === "ERR_BAD_REQUEST" && (
            <p className={styles.header__auth__error}>
              Wrong login or password
            </p>
          )}
          <div className={styles.header__auth__content}>
            <TextField
              required
              id="outlined-email-input"
              label="Enter email"
              type="email"
              autoComplete="current-email"
              value={email}
              error={!!emailError}
              helperText={emailError}
              name="email"
              onBlur={(e) => handleOnBlur(e)}
              onChange={handleEmailChange}
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                onBlur={(e) => handleOnBlur(e)}
                label="Enter password"
                value={password}
                onChange={(e) => handlePasswordChange(e)}
                error={!!passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {!!passwordError && (
                <FormHelperText error id="username-error">
                  {passwordError}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <Link href="/reset" className="forgot">
            <p>Forgot password?</p>
          </Link>

          <ButtonGroup
            fullWidth
            className={styles.header__auth__content__buttons}
            size="medium"
          >
            <Button
              variant="outlined"
              onClick={handleRegister}
              disabled={!!emailError || !!passwordError}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              onClick={handleAuth}
              disabled={!!emailError}
            >
              Sign in
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </>
  );
};

export default Auth;
