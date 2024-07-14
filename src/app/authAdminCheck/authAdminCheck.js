"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const authAdminCheck = (WrappedComponent) => {
  const LoginCheck = (props) => {
    const router = useRouter();
    const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    useEffect(() => {
      const isToken = getCookie("token");
      const email =
        typeof localStorage !== "undefined" && localStorage.getItem("email");
      if (!isToken) {
        router.push("/");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return LoginCheck;
};

export default authAdminCheck;
