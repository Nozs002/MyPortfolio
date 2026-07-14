import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to Premium Design</h1>
      <p className={styles.subtitle}>Powered by Next.js & Vanilla CSS</p>
    </main>
  );
}
