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
  const { user, loading } = useAppSelector((state) => state.User);

  useEffect(() => {
    if (user) {
      redirect("/files");
    }
  }, [user]);

  return (
    <main className={loading ? "loading" : ""}>
      {!!loading && <Preloader />}

      {!user && !loading && <Welcome />}
    </main>
  );
}
