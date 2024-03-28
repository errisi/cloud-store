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
import CloseIcon from "@mui/icons-material/Close";
import { displayValidAction } from "../utils/displayValidAction";
import { MoveModal } from "../components/MoveModal/MoveModal";

const Files = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [path, setPath] = useState<string>(searchParams.get("path") || "/");

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

  const { user, loading: userLoading } = useAppSelector((state) => state.User);

  const [files, setFiles] = useState<FilesModel[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FilesModel[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FilesModel[]>([]);
  const [action, setAction] = useState<Action | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [isActovationSnackbarOpen, setIsActovationSnackbarOpen] =
    useState(false);
  const [mediaFile, setMediaFile] = useState<FilesModel | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [isFolderForShare, setIsFolderForShare] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

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
        const data = await filesService.get(user.id, path);

        const result = data as unknown as { folders: FilesModel[] };

        const { folders } = result;

        setFiles([...folders].sort((a, b) => a.title.localeCompare(b.title)));
        setFilesLoading(false);
      };

      setFilesFromServer();
    }
  }, [path, user]);

  const selectCondition =
    !!action && action !== Action.Add && action !== Action.Upload;

  const upload = async (formData: FormData) => {
    const file = formData.get("file");

    if (file && user) {
      const newFileFromServer = await filesService.fileUpload(
        file,
        path,
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

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const isShareLinkValid = (link: string) =>
    link.split("/")[link.split("/").length - 1] !== "null";

  const toggleSelectedFileShare = async () => {
    const publicUrl = (await filesService.setPublic(
      selectedFiles[0].id
    )) as unknown as string;

    const validUrlValue = isShareLinkValid(publicUrl) ? publicUrl : null;

    setFiles((currentFiles) =>
      currentFiles.map((currentFile) =>
        currentFile.id === selectedFiles[0].id
          ? ({ ...currentFile, url: validUrlValue } as FilesModel)
          : currentFile
      )
    );

    if (selectedFiles[0].type === "folder") {
      setIsFolderForShare(true);
    }

    setShareLink(publicUrl);
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

      case Action.Share:
        if (selectedFiles[0]) {
          toggleSelectedFileShare();
          setSelectedFiles([]);
          setAction(null);
        }
        break;

      case Action.Move:
        if (selectedFiles[0]) {
          setIsMoveModalOpen(true);
          setAction(null);
        }
        break;

      default:
        break;
    }
  };

  const closeShareModal = () => {
    setShareLink("");
    setIsFolderForShare(false);
  };

  return (
    <div
      className={
        !loading 
          ? styles.page
          : styles.page__loading
      }
    >
      {!loading && (
        <div className={styles.files}>
          <Container>
            <FilesTools
              selectedFiles={selectedFiles}
              onGoBack={onGoBack}
              action={action}
              setAction={setAction}
              setSelectedFiles={setSelectedFiles}
              multiSelectCondition={selectCondition}
              upload={upload}
              files={files}
              setFilteredFiles={setFilteredFiles}
            />
            <FilesList
              files={filteredFiles}
              setFiles={setFiles}
              onPathChange={onPathChange}
              action={action}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              path={path}
              ownerId={user?.id}
              selectCondition={selectCondition}
              setAction={setAction}
              setMediaFile={setMediaFile}
            />

            <Collapse
              in={selectCondition}
              className={styles.apply}
              sx={{
                "& .MuiCollapse-wrapper .MuiCollapse-wrapperInner": {
                  display: "flex",
                  "justify-content": "flex-end",
                },
              }}
            >
              <Button variant="contained" size="large" onClick={handleApply}>
                {displayValidAction(action, selectedFiles[0])}
              </Button>
            </Collapse>
          </Container>
        </div>
      )}

      {isMoveModalOpen && (
        <MoveModal
          file={selectedFiles[0]}
          setSelectedFiles={setSelectedFiles}
          user={user}
          userLoading={userLoading}
          setIsMoveModalOpen={setIsMoveModalOpen}
          setCurrentFiles={setFiles}
        />
      )}

      {!!mediaFile && (
        <MediaList
          files={files}
          setMediaFile={setMediaFile}
          mediaFile={mediaFile}
        />
      )}

      {!!shareLink && (
        <>
          <div className={styles.share__close} onClick={closeShareModal} />
          <div className={styles.share}>
            <div className={styles.share__header}>
              <h3>Public link:</h3>
              <IconButton
                onClick={closeShareModal}
                className={styles.share__close_btn}
              >
                <CloseIcon />
              </IconButton>
            </div>
            {isShareLinkValid(shareLink) && (
              <>
                <input
                  onClick={copyShareLink}
                  value={shareLink}
                  className={styles.share__input}
                />
                <Button onClick={copyShareLink} variant="contained">
                  Copy Link
                </Button>
                {isFolderForShare && (
                  <Alert severity="info">
                    Only files will be visible in the public folder, other
                    folders will not be visible.
                  </Alert>
                )}
              </>
            )}

            {!isShareLinkValid(shareLink) && (
              <p>Successfully made non-public.</p>
            )}
          </div>
        </>
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
    </div>
  );
};

export default Files;
