import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/Coffee-Store.module.css";
import Image from "next/image";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
import useSWR from "swr";

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    (store) => store.fsq_id.toString() === params.id
  );
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : { location: "" },
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => ({
    params: { id: coffeeStore.fsq_id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export default function CoffeeStore(initialProps) {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  async function handleCreateCoffeeStore(coffeeStore) {
    try {
      const { fsq_id, name, imgUrl, voting } = coffeeStore;
      const { address: formatted_address, neighborhood } = coffeeStore.location;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fsq_id: fsq_id,
          name,
          formatted_address: formatted_address || "",
          neighborhood: neighborhood ? neighborhood[0] : "",
          imgUrl,
          voting: 0,
        }),
      });

      const dbCoffeeStore = await response.json();
      // console.log(dbCoffeeStore);
    } catch (error) {
      console.error("Error creating coffee store: ", error);
    }
  }

  useEffect(
    function () {
      if (coffeeStore.location === "") {
        if (coffeeStores.length > 0) {
          const coffeeStoreFromContext = coffeeStores.find(
            (store) => store.fsq_id.toString() === id
          );

          if (coffeeStoreFromContext) {
            setCoffeeStore(coffeeStoreFromContext);
            // console.log(coffeeStoreFromContext);
            handleCreateCoffeeStore(coffeeStoreFromContext);
          }
        }
      } else {
        handleCreateCoffeeStore(initialProps.coffeeStore);
      }
    },
    [id, initialProps, initialProps.coffeeStore]
  );

  const { name, imgUrl, location } = coffeeStore;
  const [votingCount, setVotingCount] = useState(1);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?fsq_id=${id}`);

  useEffect(
    function () {
      if (data) {
        console.log("data from swr");
        setCoffeeStore(data[0]);
      }
    },
    [data]
  );

  function handleUpvoteButton() {
    console.log("hello upvote");
    setVotingCount((count) => count + 1);
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Go Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <p className={styles.name}>{name}</p>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            />
          </div>
        </div>
        <div className={`${styles.col2} glass`}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" height={24} width={24} />
            <p className={styles.text}>{location.formatted_address}</p>
          </div>
          {location.neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" height={24} width={24} />
              <p className={styles.text}>
                {location.neighborhood
                  ? location.neighborhood[0]
                  : location.cross_street}
              </p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" height={24} width={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote!
          </button>
        </div>
      </div>
    </div>
  );
}
