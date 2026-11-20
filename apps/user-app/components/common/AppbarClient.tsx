"use client";

import { Appbar } from "@repo/ui/Appbar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const AppbarClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <Appbar
      title="Payzee"
      user={session?.user}
      isLoading={status === "loading"}
      onSignIn={() => router.push("/auth/signin")}
      onSignUp={() => router.push("/auth/signup")}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      onDashboard={() => router.push("/dashboard")}
    />
  );
};

export default AppbarClient;
