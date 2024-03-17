"use client";

import Link from "next/link";
import styles from "./Header.module.scss";
import Image from "next/image";
import SettingsIcon from "@mui/icons-material/Settings";
import StarsIcon from "@mui/icons-material/Stars";
import { IconButton, Button, Collapse } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeProvider } from "@/app/utils/ThemeProvider";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useEffect, useState } from "react";
import * as UserActions from "@/app/store/reducers/User";
import { useRouter } from "next/navigation";
import { Container } from "../Container/Container";

export const Header = () => {
  const { user, loading } = useAppSelector((state) => state.User);

  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const handleLogout = async () => {
    await dispatch(UserActions.logout());
    setIsSettingsOpened(false);
    push("/");
  };

  useEffect(() => {
    if (!user) {
      dispatch(UserActions.checkAuth());
    }
  }, [user, dispatch]);

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.header__content}>
          <Link href="/">
            <Image src="./logo.svg" alt="logo" width={44} height={44} />
          </Link>
          <nav className={styles.nav}>
            <ul className={styles.nav__list}>
              <li>
                <ThemeProvider>
                  {!!user && (
                    <>
                      <IconButton
                        onClick={() => setIsSettingsOpened((c) => !c)}
                      >
                        <SettingsIcon />
                      </IconButton>

                      <Collapse
                        in={isSettingsOpened}
                        sx={{ position: "absolute", right: 0 }}
                        onBlur={() => setIsSettingsOpened(false)}
                        className={styles.sett}
                      >
                        <div
                          onClick={() => setIsSettingsOpened(false)}
                          className={styles.settings__close}
                        />
                        <div className={styles.settings}>
                          <Button
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                          <Button startIcon={<StarsIcon />}>
                            Subscription
                          </Button>
                        </div>
                      </Collapse>
                    </>
                  )}

                  {!user && (
                    <Button variant="contained" component={Link} href="/auth">
                      Authorization
                    </Button>
                  )}
                </ThemeProvider>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};
