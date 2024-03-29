import { Dispatch, FC, SetStateAction, useState } from "react";
import styles from "./FilesTools.module.scss";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Collapse,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
} from "@mui/material";
import { Files } from "@/app/models/file.model";
import { NavigateBefore } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Action } from "@/app/types/Actions";
import { Search } from "./Search/Search";

export const FilesTools: FC<{
  onGoBack: () => void;
  action: Action | null;
  setAction: Dispatch<SetStateAction<Action | null>>;
  selectedFiles: Files[];
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
  multiSelectCondition: boolean;
  upload: (formData: FormData) => Promise<void>;
  files: Files[];
  setFilteredFiles: Dispatch<SetStateAction<Files[]>>;
}> = ({
  onGoBack,
  setAction,
  selectedFiles,
  action,
  setSelectedFiles,
  multiSelectCondition,
  upload,
  files,
  setFilteredFiles,
}) => {
  const handleActionsClose = () => {
    setSelectedFiles([]);
    setAction(null);
  };

  return (
    <>
      <Search files={files} setFilteredFiles={setFilteredFiles} />

      <div
        className={
          !multiSelectCondition ? styles.tools : `${styles.tools} ${styles.mb0}`
        }
      >
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={onGoBack} />

        <div className={styles.actions}>
          <IconButton onClick={() => setAction(Action.Add)}>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton onClick={() => setAction(Action.Move)}>
            <DriveFileMoveIcon />
          </IconButton>
          <form action={upload} className={styles.upload}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              name="file"
              onChange={(e) => e.target.form?.requestSubmit()}
            />
            <label htmlFor="raised-button-file">
              <IconButton component="span">
                <CloudUploadIcon />
              </IconButton>
            </label>
          </form>
          <IconButton onClick={() => setAction(Action.Download)}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={() => setAction(Action.Share)}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={() => setAction(Action.Delete)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      <Collapse in={multiSelectCondition}>
        <div className={`${styles.tools} ${styles.mb16}`}>
          <p
            className={styles.pl16}
          >{`Selected ${selectedFiles.length} files`}</p>

          <IconButton onClick={handleActionsClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </Collapse>
    </>
  );
};
