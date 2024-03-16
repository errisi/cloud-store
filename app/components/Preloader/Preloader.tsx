import styles from "./Preloader.module.scss";

export const Preloader = () => (
  <div className={styles.preloader}>
    <div className={styles.preloader__box}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);
