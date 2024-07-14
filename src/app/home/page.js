"use client";
import React from "react";
import authAdminCheck from "../authAdminCheck/authAdminCheck";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";

const Home = () => {
  const router = useRouter();
  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("email");
    deleteCookie("token");
  };
  return (
    <div>
      Home
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
};

export default authAdminCheck(Home);
