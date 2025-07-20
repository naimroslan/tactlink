import { useEffect } from "react";
import { router } from "expo-router";

export default function IndexRedirect() {
  useEffect(() => {
    router.replace("/login");
  }, []);

  return null;
}
