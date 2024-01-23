import { auth } from "@/auth";
import UserInfo from "@/components/user-info";
import React from "react";

interface Props {}

const ServerPage = async () => {
  const session = await auth();
  return <UserInfo user={session?.user} label="Server Component" />;
};

export default ServerPage;
