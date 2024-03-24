"use client";

import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Dispatch, FC, SetStateAction, useState } from "react";
import styles from "./File.module.scss";
import { Files } from "@/app/models/file.model";
import { Action } from "@/app/types/Actions";
import Image from "next/image";
import ReactPlayer from "react-player";

export const File: FC<{
  file: Files;
  onPathChange: (title: string) => void;
  action: Action | null;
  selectedFiles: Files[];
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
  selectCondition: boolean;
  setMediaFile: Dispatch<SetStateAction<Files | null>>;
  withoutIcon?: boolean;
}> = ({
  file,
  onPathChange,
  action,
  selectedFiles,
  setSelectedFiles,
  selectCondition,
  setMediaFile,
  withoutIcon = false,
}) => {
  const handleFileSelect = (file: Files) => {
    switch (action) {
      case Action.Delete:
        selectedFiles.includes(file)
          ? setSelectedFiles((currentFiles) =>
              currentFiles.filter((currentFile) => currentFile !== file)
            )
          : setSelectedFiles((currentFiles) => [...currentFiles, file]);
        break;

      case Action.Download:
      case Action.Share:
        selectedFiles.includes(file)
          ? setSelectedFiles([])
          : setSelectedFiles([file]);
        break;

      default:
        break;
    }
  };

  const displayCorrectFile = (file: Files, isSelect: boolean = false) => {
    switch (file.type.split("/")[0]) {
      case "folder":
        if (!isSelect) {
          return (
            <Button
              size="large"
              onClick={() => onPathChange(file.title)}
              className={styles.folder}
              sx={{ textTransform: "none" }}
            >
              <FolderIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </Button>
          );
        } else {
          return (
            <>
              <FolderIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </>
          );
        }

      case "image":
        if (!isSelect) {
          return (
            <Button
              size="large"
              className={styles.folder}
              sx={{ textTransform: "none" }}
              onClick={() => setMediaFile(file)}
            >
              <Image
                src={file.content}
                className={styles.folder__icon}
                alt="file"
                width="44"
                height="44"
              />
              <p className={styles.folder__text}>{file.title}</p>
            </Button>
          );
        } else {
          return (
            <>
              <Image
                src={file.content}
                className={styles.folder__icon}
                alt="file"
                width="44"
                height="44"
              />
              <p className={styles.folder__text}>{file.title}</p>
            </>
          );
        }

      case "video":
        if (!isSelect) {
          return (
            <Button
              size="large"
              className={styles.folder}
              sx={{ textTransform: "none" }}
              onClick={() => setMediaFile(file)}
            >
              <div className={styles.folder__icon}>
                <ReactPlayer url={file.content} width="100%" height="100%" />
              </div>
              <p className={styles.folder__text}>{file.title}</p>
            </Button>
          );
        } else {
          return (
            <>
              <video src={file.content} className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </>
          );
        }

      case "audio":
        if (!isSelect) {
          return (
            <Button
              size="large"
              className={styles.folder}
              sx={{ textTransform: "none" }}
            >
              <AudioFileIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </Button>
          );
        } else {
          return (
            <>
              <AudioFileIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </>
          );
        }

      default:
        if (!isSelect) {
          return (
            <Button
              size="large"
              className={styles.folder}
              sx={{ textTransform: "none" }}
            >
              <InsertDriveFileIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </Button>
          );
        } else {
          return (
            <>
              <InsertDriveFileIcon className={styles.folder__icon} />
              <p className={styles.folder__text}>{file.title}</p>
            </>
          );
        }
    }
  };

  const [isPublicLinkCopied, setIsPublicLinkCopied] = useState(false);

  const copyPublicLink = () => {
    if (file.url) {
      navigator.clipboard.writeText(
        `${window.location.origin}/public/${file.url}`
      );
    }

    setIsPublicLinkCopied(true);
  };

  return (
    <>
      {!selectCondition && (
        <div className={styles.folder__wrapper}>
          {file.url && !withoutIcon && (
            <IconButton
              className={styles.folder__share__icon}
              onClick={copyPublicLink}
            >
              <SensorsIcon />
            </IconButton>
          )}
          {displayCorrectFile(file)}
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isPublicLinkCopied}
        onClose={() => setIsPublicLinkCopied(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Public link has been copied
        </Alert>
      </Snackbar>

      {selectCondition && (
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
          {file.url && !withoutIcon && (
            <IconButton className={styles.folder__share__icon}>
              <SensorsIcon />
            </IconButton>
          )}
          {displayCorrectFile(file, true)}
        </Button>
      )}
    </>
  );
};
