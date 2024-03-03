"use client";

import Link from "next/link";
import styles from "./Header.module.scss";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import { TextField, IconButton } from "@mui/material";
import { ThemeProvider } from "@/app/utils/ThemeProvider";

export const Header = () => (
  <header className={styles.header}>
    <Image src="./logo.svg" alt="logo" width={44} height={44} />
    <h2 className={styles.header__search}>
      <ThemeProvider>
        <TextField size="small" />
      </ThemeProvider>
    </h2>
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        <li>
          <ThemeProvider>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </ThemeProvider>
        </li>
        <li>
          <ThemeProvider>
            <IconButton>
              <AccountCircleTwoToneIcon />
            </IconButton>
          </ThemeProvider>
        </li>
      </ul>
    </nav>
  </header>
);
