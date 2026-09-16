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
import {
  documentTypes,
  documentUploadSchema,
} from "@/lib/validations/document";

type UploadDocumentModalProps = {
  familyMemberId: string;
};

export function UploadDocumentModal({
  familyMemberId,
}: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  return (
    <Dialog>
<DialogTrigger>
  <Button>Upload Document</Button>
</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <label htmlFor="document-file" className="text-sm font-medium">
              Document file
            </label>

            <Input
              id="document-file"
              type="file"
              accept=".pdf,image/jpeg,image/png"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setFile(selectedFile);
              }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="document-type" className="text-sm font-medium">
              Document type
            </label>

            <select
              id="document-type"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              value={docType}
              onChange={(event) => setDocType(event.target.value)}
            >
              <option value="">Select document type</option>

              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiry-date" className="text-sm font-medium">
              Expiry date{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>

            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
            />
          </div>

          <Button
            className="w-full"
            type="button"
            onClick={async () => {
              setError("");

              if (!file) {
                setError("Please select a file.");
                return;
              }

              if (
                !["application/pdf", "image/jpeg", "image/png"].includes(
                  file.type,
                )
              ) {
                setError("Only PDF, JPEG, and PNG files are allowed.");
                return;
              }

              if (file.size > 10 * 1024 * 1024) {
                setError("File size must be 10 MB or less.");
                return;
              }

              const validationResult = documentUploadSchema.safeParse({
                docType,
                expiryDate: expiryDate || undefined,
              });

              if (!validationResult.success) {
                setError(validationResult.error.issues[0].message);
                return;
              }
              setLoading(true);

              const {
                data: { user },
              } = await supabase.auth.getUser();

              if (!user) {
                setError("You must be signed in to upload a document");
                setLoading(false);
                return;
              }

              const filePath = `${user.id}/${familyMemberId}/${Date.now()}-${file.name}`;

              const { error } = await supabase.storage
                .from("documents")
                .upload(filePath, file);

              if (error) {
                console.error("Error uploading document:", error);
                setError("Failed to uplaod the file");
                setLoading(false);
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

                await supabase.storage.from("documents").remove([filePath]);

                setError("Failed to save docuement information");
                setLoading(false);
                return;
              }

              console.log("Document metadata saved successfully");
              setLoading(false);
              window.location.reload();
            }}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
