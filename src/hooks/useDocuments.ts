"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Document =
  Database["public"]["Tables"]["documents"]["Row"];

export function useDocuments(familyMemberId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("family_member_id", familyMemberId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
        return;
      }

      setDocuments(data);
      setLoading(false);
    }

    fetchDocuments();
  }, [familyMemberId]);

  return {
    documents,
    loading,
  };
}