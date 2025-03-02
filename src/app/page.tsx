import Image from "next/image";
import Loader from "../components/Loader";
import SignInButton from "@/components/SignIn";

export default function Home() {
  return (
    <div className="">
      <Loader />
      <SignInButton />
    </div>
  );
}