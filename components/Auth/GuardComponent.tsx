"use client";
import { useAppSelector } from "@/utils/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function GuardComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, token } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!token || token === "" || role === null) {
      router.replace("/login");
    } else if (role === "NORMAL_USER" && pathname.startsWith("/driver")) {
      if (user?.email === "ride@fast.com") {
        router.replace("/company");
      } else {
        router.replace("/bookRide");
      }
    } else if (role === "DRIVER" && !pathname.startsWith("/driver")) {
      router.replace("/driver/dashboard");
    }
  }, [token, role, router, pathname, user?.email]);
  
  // Only render children on the client side after authentication check
  return isClient && token && role ? <>{children}</> : null;
}

export default GuardComponent;
