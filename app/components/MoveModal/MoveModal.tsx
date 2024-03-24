import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./MoveModal.module.scss";
import { filesService } from "@/app/services/client/filesService";
import { Files } from "@/app/models/file.model";
import { Action } from "@/app/types/Actions";
import { Users } from "@/app/models/user.model";
import { File } from "../File/File";
import { usePathname, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  ButtonGroup,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Preloader } from "../Preloader/Preloader";

export const MoveModal: FC<{
  file: Files;
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
  user: Users | null;
  userLoading: boolean;
  setIsMoveModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentFiles: Dispatch<SetStateAction<Files[]>>;
}> = ({
  file,
  setSelectedFiles,
  user,
  userLoading,
  setIsMoveModalOpen,
  setCurrentFiles,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [files, setFiles] = useState<Files[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [path, setPath] = useState("/");
  const [moveError, setMoveError] = useState("");

  const loading = userLoading || filesLoading;

  const onPathChange = (title: string) => {
    const newPath = path === "/" ? `/${title}` : `${path}/${title}`;
    setPath(newPath);

    router.push(`${pathname}?path=${newPath}`);
  };

  const onGoBack = () => {
    const newPath = path.split("/").slice(0, -1).join("/");
    const newPathString = newPath || "/";
    setPath(newPathString);

    router.push(`${pathname}?path=${newPathString}`);
  };

  useEffect(() => {
    if (!!user) {
      const setFilesFromServer = async () => {
        setFilesLoading(true);
        const data = await filesService.get(user.id, path);

        const result = data as unknown as { folders: Files[] };

        const { folders } = result;

        setFiles([...folders].sort((a, b) => a.title.localeCompare(b.title)));
        setFilesLoading(false);
      };

      setFilesFromServer();
    }
  }, [path, user]);

  const updatePath = async () => {
    if (file.path !== path) {
      await filesService.updatePath(file.id, path);

      setCurrentFiles((currentFiles) =>
        currentFiles.filter((currentFile) => currentFile.id !== file.id)
      );

      setPath("/");
      setSelectedFiles([]);
      setIsMoveModalOpen(false);
    } else {
      setMoveError("The path is the same as the current one");
    }
  };

  const onCancel = () => {
    setPath("/");
    setSelectedFiles([]);
    setIsMoveModalOpen(false);
  };

  return (
    <>
      <div className={styles.close} onClick={onCancel} />
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <IconButton onClick={onGoBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <p className={styles.modal__header__path}>{path}</p>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </div>

        <div
          className={
            !loading
              ? styles.modal__list__wrapper
              : `${styles.modal__list__wrapper} ${styles.modal__list__loading}`
          }
        >
          <div
            className={
              !loading ? styles.modal__list : styles.modal__list__disabled
            }
          >
            {!!files.length &&
              !loading &&
              files.map((file) => (
                <File
                  key={file.id}
                  onPathChange={onPathChange}
                  file={file}
                  action={null}
                  selectedFiles={[]}
                  setSelectedFiles={setSelectedFiles}
                  selectCondition={false}
                  setMediaFile={() => {}}
                  withoutIcon={true}
                />
              ))}

            {!files.length && !loading && (
              <p className={styles.modal__list__empty}>
                It&apos;s empty here for now
              </p>
            )}
          </div>

          {loading && <Preloader />}
        </div>

        <ButtonGroup className={styles.modal__actions}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={updatePath}>
            Apply
          </Button>
        </ButtonGroup>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={!!moveError}
          onClose={() => setMoveError("")}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {moveError}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};
