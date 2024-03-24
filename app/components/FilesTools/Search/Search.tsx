import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./Search.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, IconButton, Input, InputAdornment } from "@mui/material";
import { Files } from "@/app/models/file.model";
export const Search: FC<{
  files: Files[];
  setFilteredFiles: Dispatch<SetStateAction<Files[]>>;
}> = ({ files, setFilteredFiles }) => {
  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.title.toLowerCase().includes(searchField.toLowerCase())
      )
    );
  }, [files, searchField, setFilteredFiles, setSearchField]);

  return (
    <FormControl size="small" fullWidth className={styles.header__search}>
      <Input
        id="standard-adornment-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className={styles.search}
      />
    </FormControl>
  );
};
