import styles from "./Card.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Card(props) {
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={`${styles.container} glass`}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image src={props.imageUrl} width={260} height={160} />
          </div>
        </div>
      </a>
    </Link>
  );
}
