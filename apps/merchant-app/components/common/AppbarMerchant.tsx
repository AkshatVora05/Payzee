"use client";

import { Appbar } from "@repo/ui/Appbar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const AppbarMerchant = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <Appbar
      title="Payzee"
      portalBadge="Merchant"
      user={session?.user}
      isLoading={status === "loading"}
      signInLabel="Merchant Login"
      onSignIn={() => router.push("/auth/signin")}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      onDashboard={() => router.push("/dashboard")}
    />
  );
};

export default AppbarMerchant;
