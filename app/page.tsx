"use client";

import { Users } from "@/app/models/user.model";
import { FilesList } from "./components/FilesList/FilesList";
import * as UserActions from "@/app/store/reducers/User";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { Welcome } from "./components/Welcome/Welcome";
import { redirect } from "next/navigation";
import { Preloader } from "./components/Preloader/Preloader";

export default function Home() {
  const folders = [
    "AFSDF",
    "dfgg",
    "dfgdd",
    "dfsfsdfsdfggddddd",
    "dfgg",
    "gggg",
    "dgdfgd",
    "fghghf",
    "asd",
  ];

  const dispatch = useAppDispatch();

  const [isActovationSnackbarOpen, setIsActovationSnackbarOpen] =
    useState(false);

  const { user, loading } = useAppSelector((state) => state.User);

  useEffect(() => {
    if (!user) {
      dispatch(UserActions.checkAuth());
    }

    if (user && user.activationToken) {
      setIsActovationSnackbarOpen(true);
    }

    if (user) {
      redirect("/files");
    }
  }, [user, dispatch]);

  return (
    <main>
      {!!loading && <Preloader />}

      {!!user && !loading && (
        <>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={isActovationSnackbarOpen}
            onClose={() => setIsActovationSnackbarOpen(false)}
          >
            <Alert severity="error" sx={{ width: "100%" }}>
              Your email has not yet been activated
            </Alert>
          </Snackbar>
        </>
      )}

      {!user && !loading && <Welcome />}
    </main>
  );
}
