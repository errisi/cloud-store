"use client";

import Link from "next/link";
import styles from "./Header.module.scss";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { ThemeProvider } from "@/app/utils/ThemeProvider";

export const Header = () => (
  <header className={styles.header}>
    <Link href="/">
      <Image src="./logo.svg" alt="logo" width={44} height={44} />
    </Link>
    <h2 className={styles.header__search}>
      <ThemeProvider>
        <FormControl size="small" fullWidth className={styles.header__search}>
          <OutlinedInput
            id="standard-adornment-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </ThemeProvider>
    </h2>
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        <li>
          <ThemeProvider>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </ThemeProvider>
        </li>
      </ul>
    </nav>
  </header>
);
