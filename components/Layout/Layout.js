import React from "react";
import { Navbar, Dropdown, Avatar } from "@nextui-org/react";
import { useRouter } from "next/router";
import { pocketClient } from "../../lib/pocketbase";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ user, children }) {
  const router = useRouter();
  const logoutHandler = async () => {
    //NOTE - [Logout] clear server side authstore
    const response = await fetch("/api/logout");
    if (response.status === 200) {
      //NOTE - [logout] clear client side authstore and clear sub
      pocketClient.authStore.clear();
      router.push("/login");
    }
  };
  const actionHandler = (e) => {
    switch (e.actionKey) {
      case "logout":
        logoutHandler();
        break;

      case "profile":
        router.push("/updateprofile");
        break;

      default:
        break;
    }
  };

  if (!user.profile.profileupdated) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div>
      <Navbar variant={"sticky"} isBordered className="">
        <Navbar.Brand>
          <Link href={"/"}>
            <Image src={"/img/obb.svg"} width={104} height={60} alt="logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Content
          css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  as="button"
                  color="primary"
                  size="md"
                  text={user.profile.name}
                  textColor={"white"}
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="primary"
              onAction={(actionKey) => actionHandler({ actionKey })}
            >
              <Dropdown.Item key="profile" textValue="myprofile">
                My Profile
              </Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Content>
      </Navbar>
      <div className="">{children}</div>
    </div>
  );
}
