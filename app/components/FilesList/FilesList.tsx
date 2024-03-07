import { FC } from "react";
import { Folder } from "../Folder/Folder";
import styles from "./FilesList.module.scss";
import { Folders } from "@/app/models/folder.model";

export const FilesList: FC<{
  files: Folders[];
  onPathChange: (title: string) => void;
}> = ({ files, onPathChange }) => (
  <div className={styles.list}>
    <div className={styles.list__wrapper}>
      {files.map((file) => (
        <Folder title={file.title} onPathChange={onPathChange} />
      ))}
    </div>
  </div>
);
