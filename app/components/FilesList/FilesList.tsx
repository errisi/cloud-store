import { FC } from "react";
import { Folder } from "../Folder/Folder";
import styles from "./FilesList.module.scss";

export const FilesList: FC<{ files: string[] }> = ({ files }) => (
  <div className={styles.list}>
    <div className={styles.list__wrapper}>
      {files.map((file) => (
        <Folder title={file} />
      ))}
    </div>
  </div>
);
