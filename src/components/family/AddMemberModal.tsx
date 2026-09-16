"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddMemberModal() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!name.trim() || !relationship.trim()) {
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("family_members").insert({
      owner_id: user.id,
      name: name.trim(),
      relationship: relationship.trim(),
    });

    if (error) {
      console.error("Error adding family member:", error);
      setLoading(false);
      return;
    }

    setName("");
    setRelationship("");
    setLoading(false);

    window.location.reload();
  };

  return (
    <Dialog>
<DialogTrigger>
  <Button>Add Family Member</Button>
</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Input
            placeholder="Relationship (e.g. Father)"
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleAddMember}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}