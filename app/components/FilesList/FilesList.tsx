import { Dispatch, FC, SetStateAction } from "react";
import { Folder } from "../File/File";
import styles from "./FilesList.module.scss";
import { Files } from "@/app/models/file.model";
import { Action } from "@/app/types/Actions";

export const FilesList: FC<{
  files: Files[];
  onPathChange: (title: string) => void;
  action: Action | null;
  selectedFiles: Files[];
  setSelectedFiles: Dispatch<SetStateAction<Files[]>>;
}> = ({ files, onPathChange, action, selectedFiles, setSelectedFiles }) => (
  <div className={styles.list}>
    <div className={styles.list__wrapper}>
      {files.map((file) => (
        <Folder
          key={file.id}
          file={file}
          onPathChange={onPathChange}
          action={action}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      ))}
    </div>
  </div>
);
