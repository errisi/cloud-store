"use client";

import { useEffect, useState } from "react";
import { Folders } from "../models/folder.model";
import { useAppSelector } from "../store/hooks";
import { Folder } from "@mui/icons-material";
import { FilesList } from "../components/FilesList/FilesList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { foldersService } from "../services/client/flodersService";

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

  const [files, setFiles] = useState<Folders[]>([]);

  const { user } = useAppSelector((state) => state.User);

  useEffect(() => {
    if (!!user) {
      const setFilesFromServer = async () => {
        const data = await foldersService.get(
          user.id,
          path ? `/${path.join("/")}` : "/"
        );

        const result = data as unknown as { folders: Folders[] };

        const { folders } = result;

        setFiles(folders);
      };

      setFilesFromServer();
    }
  }, [path, user]);

  return <FilesList files={files} onPathChange={onPathChange} />;
};

export default Files;
