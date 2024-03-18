"use client";

import { Button } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { Dispatch, FC, SetStateAction } from "react";
import { ThemeProvider } from "@/app/utils/ThemeProvider";
import styles from "./File.module.scss";
import { Files } from "@/app/models/file.model";
import { Action } from "@/app/types/Actions";

export const Folder: FC<{
  file: Files;
  onPathChange: (title: string) => void;
  action: Action | null;
  selectedFiles: Files[];
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
}> = ({ file, onPathChange, action, selectedFiles, setSelectedFiles }) => {
  const handleFileSelect = (file: Files) => {
    selectedFiles.includes(file)
      ? setSelectedFiles((currentFiles) =>
          currentFiles.filter((currentFile) => currentFile !== file)
        )
      : setSelectedFiles((currentFiles) => [...currentFiles, file]);

    console.log(selectedFiles);
  };

  return (
    <>
      {!action && (
        <Button
          size="large"
          onClick={() => onPathChange(file.title)}
          className={styles.folder}
          sx={{ textTransform: "none" }}
        >
          <FolderIcon className={styles.folder__icon} />
          <p className={styles.folder__text}>{file.title}</p>
        </Button>
      )}

      {!!action && (
        <Button
          size="large"
          onClick={() => handleFileSelect(file)}
          disableRipple
          className={
            selectedFiles.includes(file)
              ? `${styles.folder} ${styles.folder__select__true}`
              : `${styles.folder} ${styles.folder__select}`
          }
          sx={{
            textTransform: "none",
          }}
        >
          <FolderIcon className={styles.folder__icon} />
          <p className={styles.folder__text}>{file.title}</p>
        </Button>
      )}
    </>
  );
};
