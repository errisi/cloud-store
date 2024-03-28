"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Files } from "@/app/models/file.model";
import { filesService } from "@/app/services/client/filesService";
import { File } from "@/app/components/File/File";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Action } from "@/app/types/Actions";
import { MediaList } from "@/app/components/MediaList/MediaList";
import { Container } from "@/app/components/Container/Container";
import { Search } from "@/app/components/FilesTools/Search/Search";
import { Button, Collapse, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";

const ResetPasswordPage = ({ params }: { params: Params }) => {
  const [files, setFiles] = useState<Files[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<Files[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [action, setAction] = useState<Action | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Files[]>([]);
  const [mediaFile, setMediaFile] = useState<Files | null>(null);
  const [filesError, setFilesError] = useState("");
  const fileUrl = params.fileUrl;

  useEffect(() => {
    const setFilesFromServer = async () => {
      setFilesLoading(true);
      setFilesError("");
      try {
        const result = (await filesService.getPublic(
          fileUrl
        )) as unknown as Files[];

        const filesFromServer = result as unknown as { folders: Files[] };

        const { folders } = filesFromServer;

        console.log(result);

        setFiles(
          [...folders]
            .sort((a, b) => a.title.localeCompare(b.title))
            .filter((currentFile) => currentFile.type !== "folder")
        );
      } catch (error) {
        setFilesError(
          `Something went wrong, this is what our server says: ${error}`
        );
      }
      setFilesLoading(false);
    };

    setFilesFromServer();
  }, [fileUrl]);

  const download = () => {
    if (selectedFiles[0].type !== "folder") {
      window.open(selectedFiles[0].content);
      setSelectedFiles([]);
      setAction(null);
    }
  };

  const handleActionsClose = () => {
    setSelectedFiles([]);
    setAction(null);
  };

  return (
    <div className={!filesLoading ? styles.page : styles.page__loading}>
      {!!filesLoading && <Preloader />}
      <Container>
        <Search files={files} setFilteredFiles={setFilteredFiles} />

        <div
          className={
            !action
              ? styles.actions
              : `${styles.actions} ${styles.actions__active}`
          }
        >
          <div />
          {!action && !filesError && (
            <>
              <IconButton onClick={() => setAction(Action.Download)}>
                <DownloadIcon />
              </IconButton>
            </>
          )}
          {!!action && (
            <>
              <IconButton onClick={handleActionsClose}>
                <CloseIcon />
              </IconButton>
            </>
          )}
          <Collapse in={!!action} sx={{ position: "absolute" }}>
            <p
              className={styles.actions__text}
            >{`Selected ${selectedFiles.length} files`}</p>
          </Collapse>
        </div>

        <div className={styles.list}>
          <div className={styles.list__wrapper}>
            {!!files.length &&
              filteredFiles.map((file) => (
                <File
                  key={file.id}
                  onPathChange={(title: string) => {}}
                  file={file}
                  action={action}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  selectCondition={!!action}
                  setMediaFile={setMediaFile}
                  withoutIcon={true}
                />
              ))}

            {!filteredFiles.length && !filesLoading && !filesError && (
              <p className={styles.list__empty}>It&apos;s empty here for now</p>
            )}
          </div>
        </div>
        {!files.length && !filesLoading && filesError && <p>{filesError}</p>}

        <Collapse
          in={!!action}
          className={styles.apply}
          sx={{
            "& .MuiCollapse-wrapper .MuiCollapse-wrapperInner": {
              display: "flex",
              "justify-content": "flex-end",
            },
          }}
        >
          <Button variant="contained" size="large" onClick={download}>
            {Action.Download}
          </Button>
        </Collapse>
      </Container>
      {!!mediaFile && (
        <MediaList
          files={files}
          setMediaFile={setMediaFile}
          mediaFile={mediaFile}
        />
      )}
    </div>
  );
};

export default ResetPasswordPage;
