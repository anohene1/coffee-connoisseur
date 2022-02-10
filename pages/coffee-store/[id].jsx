import { useRouter } from "next/router";
import Link from "next/link";

export default function CoffeeStore() {
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
