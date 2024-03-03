"use client";

import { Button } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { FC } from "react";
import { ThemeProvider } from "@/app/utils/ThemeProvider";
import styles from "./Folder.module.scss";

export const Folder: FC<{ title: string }> = ({ title }) => (
  <ThemeProvider>
    <Button
      size="large"
      className={styles.folder}
      sx={{ textTransform: "none" }}
    >
      <FolderIcon className={styles.folder__icon} />
      <p className={styles.folder__text}>{title}</p>
    </Button>
  </ThemeProvider>
);
