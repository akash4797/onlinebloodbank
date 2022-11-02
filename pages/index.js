import Head from "next/head";
import React from "react";
import { NextAuthStore, pocketClient } from "../lib/pocketbase";
import Layout from "../components/Layout/Layout";

export default function Home({ user }) {
  return (
    <div>
      <Head>
        <title>Online Blood Bank</title>
        <meta name="description" content="Online Blood Bank" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout user={user}>
          <div className="h-screen flex justify-center items-center">
            <h1 className="text-6xl font-semibold">Online Blood Bank</h1>
          </div>
        </Layout>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  pocketClient.authStore = new NextAuthStore(req, res);

  if (!pocketClient.authStore.isValid) {
    return {
      redirect: {
        parmanent: false,
        destination: "/login",
      },
    };
  }

  let user;
  try {
    const reqUser = await pocketClient.users.getOne(
      // @ts-ignore
      pocketClient.authStore.model?.id
    );
    user = JSON.parse(JSON.stringify(reqUser));
    if (user.profile.admin) throw new Error("Not Authorized");
    if (!user.profile.profileupdated) {
      return {
        redirect: {
          parmanent: false,
          destination: "/updateprofile",
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        parmanent: false,
        destination: "/login",
      },
    };
  }

  await pocketClient.users.refresh();
  return {
    props: {
      user,
    },
  };
}
