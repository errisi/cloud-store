import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { File } from "../File/File";
import styles from "./FilesList.module.scss";
import { Files } from "@/app/models/file.model";
import { Action } from "@/app/types/Actions";
import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { filesService } from "@/app/services/client/filesService";
import CloseIcon from "@mui/icons-material/Close";

export const FilesList: FC<{
  files: Files[];
  onPathChange: (title: string) => void;
  action: Action | null;
  selectedFiles: Files[];
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
  path: string;
  ownerId: number | undefined;
  setFiles: Dispatch<SetStateAction<Files[]>>;
  selectCondition: boolean;
  setAction: Dispatch<SetStateAction<Action | null>>;
  setMediaFile: Dispatch<SetStateAction<Files | null>>;
}> = ({
  files,
  onPathChange,
  action,
  setAction,
  selectedFiles,
  setSelectedFiles,
  path,
  ownerId,
  setFiles,
  selectCondition,
  setMediaFile,
}) => {
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [isNewFolderLoading, setIsNewFolderLoading] = useState(false);
  const [newFolderError, setNewFolderError] = useState("");

  const onAddFolderSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsNewFolderLoading(true);

    if (!ownerId) {
      return;
    }

    try {
      const newFolderFromServer = await filesService.folderCreate(
        newFolderTitle,
        path,
        ownerId
      );

      const newFolder = newFolderFromServer as unknown as { newFolder: Files };

      setFiles((c) => [...c, newFolder.newFolder]);

      setNewFolderError("");
    } catch (error: any) {
      setNewFolderError(error.response.data.error);
    }

    setIsNewFolderLoading(false);
    setNewFolderTitle("");
    setAction(null);
  };

  const onAddFolderCancel = () => {
    setNewFolderTitle("");
    setAction(null);
  };

  return (
    <div className={styles.list}>
      <div className={styles.list__wrapper}>
        {!!files.length &&
          files.map((file) => (
            <File
              key={file.id}
              file={file}
              onPathChange={onPathChange}
              action={action}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectCondition={selectCondition}
              setMediaFile={setMediaFile}
            />
          ))}

        {!files.length && (
          <p className={styles.list__empty}>It&apos;s empty here for now</p>
        )}

        {action === Action.Add && (
          <form
            className={styles.folder}
            onSubmit={(e) =>
              !isNewFolderLoading ? onAddFolderSubmit(e) : e.preventDefault()
            }
          >
            <IconButton
              className={styles.folder__cancel}
              onClick={onAddFolderCancel}
              disabled={isNewFolderLoading}
            >
              <CloseIcon />
            </IconButton>
            <FolderIcon className={styles.folder__icon} />
            <input
              disabled={isNewFolderLoading}
              type="text"
              className={styles.folder__input}
              value={newFolderTitle}
              onChange={(e) => setNewFolderTitle(e.target.value)}
            />
          </form>
        )}
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={!!newFolderError}
        onClose={() => setNewFolderError("")}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {newFolderError}
        </Alert>
      </Snackbar>
    </div>
  );
};
