import styles from "./Welcome.module.scss";

export const Welcome = () => (
  <div className={styles.content}>
    <div className={styles.content__block}>
      <h1 className={styles.title}>Your Ultimate Crypto-Powered Storage Solution</h1>
      <p>
        At SecureCloud, we offer a cutting-edge cloud storage platform tailored
        for those who prioritize <strong> security, anonymity, and confidentiality</strong>. With
        a strong emphasis on safeguarding your data, we provide a seamless
        experience where <strong>privacy is paramount.</strong>
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>Unmatched Security:</h2>
      <p>
        Your <strong>data security is our top priority.</strong> Utilizing state-of-the-art
        encryption protocols, we ensure that <strong>your files are protected against
        unauthorized access or breaches.</strong>
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>Total Anonymity:</h2>
      <p>
        We understand the importance of anonymity in today&apos;s digital
        landscape. That&apos;s why <strong>we don&apos;t require any personally
        identifiable information during the registration process.</strong> Your privacy
        is respected at every step, allowing you to store and access your data
        without compromising your identity.
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>Absolute Confidentiality:</h2>
      <p>
        Rest assured that your data is yours and yours alone. We adhere strictly
        to a no-sharing policy, meaning <strong>your files are never shared with third
        parties.</strong> Whether it&apos;s personal documents, sensitive business files,
        or cherished memories, your information remains <strong>confidential and
        inaccessible to anyone but you.</strong>
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>Crypto-Powered Payments:</h2>
      <p>
        In line with our commitment to privacy, <strong>we accept payments in
        cryptocurrency.</strong> This ensures that your financial transactions are
        secure, private, and free from centralized control. Embracing the
        decentralized nature of blockchain technology, we empower you to <strong>pay for
        our services without sacrificing your anonymity.</strong>
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>User-Centric Approach:</h2>
      <p>
        At SecureCloud, we prioritize the needs and preferences of our users
        above all else. Our <strong>intuitive interface and user-friendly features</strong> make
        storing, accessing, and managing your data effortless. Whether
        you&apos;re an individual user or a business seeking secure cloud
        storage solutions, we&apos;ve got you covered.
      </p>
    </div>
    <div className={styles.content__block}>
      <h2>Experience the Future of Secure Cloud Storage:</h2>
      <p>
        Join SecureCloud today and experience a new standard of privacy-centric
        cloud storage. <strong>Protect your data, preserve your anonymity, and secure
        your peace of mind with our innovative platform.</strong> Your privacy is
        non-negotiable, and with SecureCloud, it&apos;s guaranteed.
      </p>
    </div>
  </div>
);
