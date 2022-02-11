import { useRouter } from "next/router";
import Link from "next/link";
import coffeeStoresData from "../../data/coffee-stores.json";

export async function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (store) => store.id.toString() === params.id
      ),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: "0" } },
      { params: { id: "1" } },
      { params: { id: "300" } },
    ],
    fallback: false,
  };
}

export default function CoffeeStore(props) {
  const router = useRouter();
  return (
    <div>
      <p>Coffee Store {router.query.id}</p>
      <Link href="/">
        <a>Go Back to home</a>
      </Link>
    </div>
  );
}
