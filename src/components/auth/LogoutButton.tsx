"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/auth");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}