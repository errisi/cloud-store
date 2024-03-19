"use client";

import { useEffect, useRef, useState } from "react";
import { Files as FilesModel } from "../models/file.model";
import { useAppSelector } from "../store/hooks";
import { Folder } from "@mui/icons-material";
import { FilesList } from "../components/FilesList/FilesList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filesService } from "../services/client/filesService";
import { FilesTools } from "../components/FilesTools/FilesTools";
import { Action } from "../types/Actions";
import { Alert, Button, Collapse, IconButton, Snackbar } from "@mui/material";
import styles from "./page.module.scss";
import { Container } from "../components/Container/Container";
import { Preloader } from "../components/Preloader/Preloader";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MediaList } from "../components/MediaList/MediaList";

export const Files = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [path, setPath] = useState<string[]>(searchParams.getAll("path"));

  const onPathChange = (title: string) => {
    const newPath = path ? [...path, title] : [title];
    setPath(newPath);

    router.push(`${pathname}?path=${newPath.join("/")}`);
  };

  const onGoBack = () => {
    const newPath = [...path];
    newPath.pop();

    setPath(newPath);
    router.push(`${pathname}?path=${newPath.join("/")}`);
  };

  const { user, loading: userLoading } = useAppSelector((state) => state.User);

  const [files, setFiles] = useState<FilesModel[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FilesModel[]>([]);
  const [action, setAction] = useState<Action | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [isActovationSnackbarOpen, setIsActovationSnackbarOpen] =
    useState(false);
  const [mediaFile, setMediaFile] = useState<FilesModel | null>(null);

  const loading = userLoading || filesLoading;

  useEffect(() => {
    if (user && user.activationToken) {
      setIsActovationSnackbarOpen(true);
    }
  }, [user]);

  useEffect(() => {
    if (!!user) {
      const setFilesFromServer = async () => {
        setFilesLoading(true);
        const data = await filesService.get(
          user.id,
          path.length ? `${path.join("/")}` : "/"
        );

        const result = data as unknown as { folders: FilesModel[] };

        const { folders } = result;

        setFiles([...folders].sort((a, b) => a.title.localeCompare(b.title)));
        setFilesLoading(false);
      };

      setFilesFromServer();
    }
  }, [path, user]);

  const multiSelectCondition =
    !!action && action !== Action.Add && action !== Action.Upload;

  const upload = async (formData: FormData) => {
    const file = formData.get("file");

    if (file && user) {
      const validPass = path.length ? `${path.join("/")}` : "/";

      const newFileFromServer = await filesService.fileUpload(
        file,
        validPass,
        user.id
      );

      const newFile = newFileFromServer as unknown as { newFile: FilesModel };

      setFiles((c) => [...c, newFile.newFile]);
    }
  };

  const removeSelectedFiles = async () => {
    const filesIds = selectedFiles.map((file) => file.id);

    await filesService.filesDelete(filesIds);

    setFiles((c) => c.filter((file) => !filesIds.includes(file.id)));
  };

  const handleApply = () => {
    switch (action) {
      case Action.Delete:
        removeSelectedFiles();
        setSelectedFiles([]);
        setAction(null);
        break;

      case Action.Download:
        if (selectedFiles[0].type !== "folder") {
          window.open(selectedFiles[0].content);
          setSelectedFiles([]);
          setAction(null);
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      {!loading && (
        <div className={styles.files}>
          <Container>
            <FilesTools
              selectedFiles={selectedFiles}
              onGoBack={onGoBack}
              action={action}
              setAction={setAction}
              setSelectedFiles={setSelectedFiles}
              multiSelectCondition={multiSelectCondition}
              upload={upload}
            />
            <FilesList
              files={files}
              setFiles={setFiles}
              onPathChange={onPathChange}
              action={action}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              path={path}
              ownerId={user?.id}
              multiSelectCondition={multiSelectCondition}
              setAction={setAction}
              setMediaFile={setMediaFile}
            />

            <Collapse in={multiSelectCondition} className={styles.apply}>
              <Button variant="contained" size="large" onClick={handleApply}>
                {action}
              </Button>
            </Collapse>
          </Container>
        </div>
      )}

      {!!mediaFile && (
        <MediaList
          files={files}
          setMediaFile={setMediaFile}
          mediaFile={mediaFile}
        />
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isActovationSnackbarOpen}
        onClose={() => setIsActovationSnackbarOpen(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Your email has not yet been activated
        </Alert>
      </Snackbar>

      {!!loading && <Preloader />}
    </>
  );
};

export default Files;
