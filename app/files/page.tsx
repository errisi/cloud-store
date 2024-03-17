"use client";

import { useEffect, useState } from "react";
import { Files as FilesModel } from "../models/file.model";
import { useAppSelector } from "../store/hooks";
import { Folder } from "@mui/icons-material";
import { FilesList } from "../components/FilesList/FilesList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filesService } from "../services/client/filesService";
import { FilesTools } from "../components/FilesTools/FilesTools";
import { Action } from "../types/Actions";
import { Button, Collapse } from "@mui/material";
import styles from "./page.module.scss";
import { Container } from "../components/Container/Container";
import { Preloader } from "../components/Preloader/Preloader";

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

  const [files, setFiles] = useState<FilesModel[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FilesModel[]>([]);
  const [action, setAction] = useState<Action | null>(null);

  const { user, loading } = useAppSelector((state) => state.User);

  useEffect(() => {
    if (!!user) {
      const setFilesFromServer = async () => {
        const data = await filesService.get(
          user.id,
          path ? `/${path.join("/")}` : "/"
        );

        const result = data as unknown as { folders: FilesModel[] };

        const { folders } = result;

        setFiles(folders);
      };

      setFilesFromServer();
    }
  }, [path, user]);

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
            />
            <FilesList
              files={files}
              onPathChange={onPathChange}
              action={action}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />

            <Collapse in={!!action} className={styles.apply}>
              <Button variant="outlined" size="large">
                Apply
              </Button>
            </Collapse>
          </Container>
        </div>
      )}

      {!!loading && <Preloader />}
    </>
  );
};

export default Files;
