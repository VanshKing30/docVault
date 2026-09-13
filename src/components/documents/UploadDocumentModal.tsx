"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type UploadDocumentModalProps = {
  familyMemberId: string;
};

export function UploadDocumentModal({
  familyMemberId,
}: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const supabase = createClient();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Document</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf,image/jpeg,image/png"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0] ?? null;
              setFile(selectedFile);
            }}
          />

          <Input
            placeholder="Document type (e.g. Aadhaar Card)"
            value={docType}
            onChange={(event) => setDocType(event.target.value)}
          />

          <Input
            type="date"
            value={expiryDate}
            onChange={(event) => setExpiryDate(event.target.value)}
          />

          <Button
            className="w-full"
            type="button"
            onClick={async () => {
              if (!file) {
                return;
              }

              const {
                data: { user },
              } = await supabase.auth.getUser();

              if (!user) {
                return;
              }

              const filePath = `${user.id}/${familyMemberId}/${Date.now()}-${file.name}`;

              const { error } = await supabase.storage
                .from("documents")
                .upload(filePath, file);

              if (error) {
                console.error("Error uploading document:", error);
                return;
              }

              console.log("File uploaded successfully:", filePath);
              const { error: databaseError } = await supabase
                .from("documents")
                .insert({
                  owner_id: user.id,
                  family_member_id: familyMemberId,
                  doc_type: docType,
                  file_name: file.name,
                  file_path: filePath,
                  file_size: file.size,
                  expiry_date: expiryDate || null,
                });

              if (databaseError) {
                console.error("Error saving document metadata:", databaseError);
                return;
              }

              console.log("Document metadata saved successfully");
              window.location.reload();
            }}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
