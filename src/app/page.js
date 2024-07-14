"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import authAdminCheck from "./authAdminCheck/authAdminCheck";

const Home = () => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("email");
  };

  useEffect(() => {
    if (session) {
      localStorage.setItem("email", session.user.email);
    }
  }, [session]);

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn("github")}>Github</button>
      <button onClick={() => signIn("google")}>Google</button>
    </div>
  );
};

export default authAdminCheck(Home);
