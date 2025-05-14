import Image, { type ImageProps } from "next/image";
import { FaGithub } from "react-icons/fa";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className="h2">Family Storybooks</span>
        <a
          href="https://github.com/justono1/family-history-storybook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={"32"} />
        </a>
      </nav>
      <main className={styles.main}>
        {/* ← Left sidebar */}
        <aside className={styles.sidebar}>Lorem ipsum dolor,</aside>

        {/* → Right content area */}
        <section className={styles.content}>
          <h1>Welcome!</h1>
          <p>This is your main content area.</p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero nemo
          laudantium beatae officiis sed corporis, placeat sequi aliquid quod
          repellat ratione commodi ab repellendus, iste ex accusamus! Animi,
          enim quasi. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Vero nemo laudantium beatae officiis sed corporis, placeat sequi
          aliquid quod repellat ratione commodi ab repellendus, iste ex
          accusamus! Animi, enim quasi. Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Vero nemo laudantium beatae officiis sed corporis,
          placeat sequi aliquid quod repellat ratione commodi ab repellendus,
          iste ex accusamus! Animi, enim quasi. Lorem ipsum dolor, sit amet
          consectetur adipisicing elit.
        </section>
      </main>
    </div>
  );
}
