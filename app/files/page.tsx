"use client";

import { useEffect, useState } from "react";
import { Files as FilesModel } from "../models/file.model";
import { useAppSelector } from "../store/hooks";
import { Folder } from "@mui/icons-material";
import { FilesList } from "../components/FilesList/FilesList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filesService } from "../services/client/filesService";
import { FilesTools } from "../components/FilesTools/FilesTools";

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

  const [files, setFiles] = useState<FilesModel[]>([]);

  const { user } = useAppSelector((state) => state.User);

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
      <FilesTools files={files} />
      <FilesList files={files} onPathChange={onPathChange} />
    </>
  );
};

export default Files;