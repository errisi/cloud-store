"use client";

import { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./page.module.scss";
import { authService } from "@/app/services/client/authService";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

const ResetPasswordPage = ({ params }: { params: Params }) => {
  const resetToken = params.resetToken;
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSucces, setIsSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
    setIsSuccess(false);

    if (e.target.value.length && e.target.value.length < 8) {
      setPasswordError("Password must be longer than 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleResetPassword = () => {
    if (resetToken) {
      authService.resetPassword(resetToken as string, password);
      setIsSuccess(true);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__block}>
        <h3>Set a new password</h3>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">
            New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            label="New Password"
            value={password}
            autoComplete="off"
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
            <FormHelperText error id="password-error">
              {passwordError}
            </FormHelperText>
          )}
        </FormControl>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={handleResetPassword}
          disabled={!password || !!passwordError || isSucces}
        >
          Set password
        </Button>
        {isSucces && (
          <p className={styles.content__text}>
            The password has been successfully changed.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
