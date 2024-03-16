import { FC } from "react";
import styles from "./FilesTools.module.scss";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
} from "@mui/material";
import { Files } from "@/app/models/file.model";

export const FilesTools: FC<{ files: Files[] }> = ({ files }) => {
  return (
    <>
      <FormControl size="small" fullWidth className={styles.header__search}>
        <Input
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

      <div className={styles.tools}>
        <Button startIcon={<ArrowBackIosNewIcon />}></Button>

        <div className="actions">
          <IconButton>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton>
            <CloudUploadIcon />
          </IconButton>
          <IconButton>
            <DownloadIcon />
          </IconButton>
          <IconButton>
            <DriveFileRenameOutlineIcon />
          </IconButton>
          <IconButton>
            <ShareIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};
