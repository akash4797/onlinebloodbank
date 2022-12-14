import Head from "next/head";
import React from "react";
import { pocketClient, NextAuthStore } from "../lib/pocketbase";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      //NOTE - [Login] login for client side
      await pocketClient.users.authViaEmail(email, password);

      //NOTE - [login] login for server side (ssr)
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();
      console.log(response.status);
      if (response.status === 200) {
        router.push("/");
      } else {
        //TODO - notify not authorized as admin while login
        alert("something is wrong");
      }
    } catch (e) {
      //TODO - notify login problems
      alert("something is wrong");
    }
  };

  return (
    <div>
      <Head>
        <title>Online Blood Bank | Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen flex justify-center items-center w-full">
        <div
          className="w-1/2 bg-cover h-full bg-center bg-blend-overlay bg-black bg-opacity-50 flex items-center text-white shadow-xl"
          style={{
            backgroundImage: "url('/img/login.jpg')",
          }}
        >
          <div className="p-10 flex gap-3 flex-col w-4/5">
            <div className="mb-5">
              <Image src={"/img/obb2.svg"} width={130} height={86} alt="logo" />
            </div>
            <h1 className="text-4xl font-black">Online Blood Bank</h1>
            <span className="text-justify">
              Dolor ad pariatur adipisicing Lorem reprehenderit adipisicing.
              Elit aliqua aliqua eu labore veniam cupidatat voluptate incididunt
              dolore est magna commodo quis nostrud irure. Tempor aliqua nostrud
              esse ipsum ut sit adipisicing. Commodo culpa occaecat officia qui.
            </span>
          </div>
        </div>
        <div className="w-1/2 flex justify-center">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => handleSubmit(e)}
          >
            <h1 className="text-3xl font-bold text-center uppercase">Login</h1>
            <input
              name="email"
              type="text"
              placeholder="Email"
              className="border p-2"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border p-2"
            />
            <input
              type="submit"
              value={"Submit"}
              className="bg-black text-white p-2 w-full cursor-pointer"
            />
            <span>
              {"Don't have an account? "}
              <Link href={"/signup"}>
                <button className="text-blue-600">Sign Up</button>
              </Link>
            </span>
          </form>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  pocketClient.authStore = new NextAuthStore(req, res);

  let user;
  try {
    const reqUser = await pocketClient.users.getOne(
      // @ts-ignore
      pocketClient.authStore.model?.id
    );
    user = JSON.parse(JSON.stringify(reqUser));
  } catch (error) {
    console.log(error);
  }

  if (pocketClient.authStore.isValid && user && !user.profile.admin) {
    return {
      redirect: {
        parmanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}
