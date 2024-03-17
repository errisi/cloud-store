"use client";

import { Button, TextField } from "@mui/material";
import styles from "./page.module.scss";
import { authService } from "../services/client/authService";
import { ChangeEvent, useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSucces, setIsSuccess] = useState(false);

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
    setIsSuccess(false);
    const re = new RegExp(
      `^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$`,
      "i"
    );

    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError("Incorrect Email");
    } else {
      setEmailError("");
    }
  };

  const handleSendResetToken = async () => {
    authService.sendResetToken(email);
    setIsSuccess(true);
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__block}>
        <h3>Enter account email</h3>
        <TextField
          fullWidth
          id="outlined-email-input"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e)}
          error={!!emailError}
          helperText={emailError}
        />
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={handleSendResetToken}
          disabled={!email || !!emailError || isSucces}
        >
          Reset the password
        </Button>
        {isSucces && (
          <p className={styles.content__text}>
            A link to reset your password has been sent to the specified email.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;