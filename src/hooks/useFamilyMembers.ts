"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"];

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching family members:", error);
        setLoading(false);
        return;
      }

      setMembers(data);
      setLoading(false);
    }

    fetchMembers();
  }, []);

  return {
    members,
    loading,
  };
}