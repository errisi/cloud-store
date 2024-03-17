"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { authService } from "../../services/client/authService";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Preloader } from "@/app/components/Preloader/Preloader";

const ActivationPage = ({ params }: { params: Params }) => {
  const activationToken = params.activationToken;
  const [isAccountActive, setIsAccountActive] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activationToken) {
      setIsLoading(true);
      authService
        .activate(activationToken)
        .then(() => setIsAccountActive(true))
        .catch((e) =>
          setError(`
          Что-то пошло не так, вот что говорит наш сервер: ${e}.
          Возможно ваш аккаунт уже был активирован или ссылка была указана не верно.
        `)
        )
        .finally(() => setIsLoading(false));
    } else {
      setError("Отсутствует ключ активации, попробуйте еще раз.");
    }
  }, [activationToken]);

  return (
    <div className={styles.content}>
      <div className={styles.content__block}>
        {!!error && !isLoading && !isAccountActive && (
          <p className={styles.content__block__error}>{error}</p>
        )}
        {isAccountActive && (
          <p className={styles.content__block__success}>
            Ваш аккаунт теперь активирован
          </p>
        )}
        {!error && !isAccountActive && isLoading && <Preloader />}
      </div>
    </div>
  );
};

export default ActivationPage;
