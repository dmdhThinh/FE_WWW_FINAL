"use client";

import MyAccount from "@/components/MyAccount";
import React from "react";
import { useSearchParams } from "next/navigation";

const MyAccountPage = () => {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    console.log("📄 MyAccountPage - Current URL:", window.location.pathname + window.location.search);
    console.log("📄 MyAccountPage - searchParams:", Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
