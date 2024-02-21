import Link from "next/link";
import { FacebookIcon, InstagramIcon } from "./icons";

export function Maintenance() {
  return (
    <section className="container">
      <h1 className="text-3xl mb-2 font-medium">Under Maintenance</h1>
      <p className="mb-6 text-sm">
        Hello! We&apos;re currently fixing things up. Please come back later. Thank you for your patience!
      </p>
      <div className="mt-2 flex space-x-4 text-sm">
        <Link
          className="flex items-center space-x-2 leading-none"
          href="https://www.instagram.com/umamin.app/"
          target="_blank"
        >
          <InstagramIcon />
          <p>@umamin.app</p>
        </Link>

        <Link
          className="flex items-center space-x-2 leading-none"
          href="https://www.facebook.com/umamin.official/"
          target="_blank"
        >
          <FacebookIcon />
          <p>@umamin.official</p>
        </Link>
      </div>
    </section>
  );
}
