import { FC } from "react";
import { Folder } from "../Folder/Folder";
import styles from "./FilesList.module.scss";
import { Files } from "@/app/models/file.model";

export const FilesList: FC<{
  files: Files[];
  onPathChange: (title: string) => void;
}> = ({ files, onPathChange }) => (
  <div className={styles.list}>
    <div className={styles.list__wrapper}>
      {files.map((file) => (
        <Folder key={file.id} title={file.title} onPathChange={onPathChange} />
      ))}
    </div>
  </div>
);
