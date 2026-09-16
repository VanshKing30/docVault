"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

type Document = Database["public"]["Tables"]["documents"]["Row"];

type DocumentCardProps = {
  document: Document;
};

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleView = async () => {
    setViewing(true);

    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 300);

    if (error) {
      console.error("Error creating signed URL:", error);
      setViewing(false);
      return;
    }

    window.open(data.signedUrl, "_blank");

    setViewing(false);
  };

  const handleDownload = async () => {
    setDownloading(true);

    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 300, {
        download: doc.file_name,
      });

    if (error) {
      console.error("Error creating download URL:", error);
      setDownloading(false);
      return;
    }

    const link = window.document.createElement("a");

    link.href = data.signedUrl;
    link.download = doc.file_name;

    window.document.body.appendChild(link);
    link.click();
    link.remove();

    setDownloading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const supabase = createClient();

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.file_path]);

    if (storageError) {
      console.error("Error deleting file:", storageError);
      setDeleting(false);
      return;
    }

    const { error: databaseError } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);

    if (databaseError) {
      console.error("Error deleting document metadata:", databaseError);
      setDeleting(false);
      return;
    }

    console.log("Document deleted successfully");

    window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="break-words text-base">{doc.file_name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{doc.doc_type}</Badge>

          {doc.expiry_date && (
            <Badge variant="outline">Expires {doc.expiry_date}</Badge>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">
            Size: {(doc.file_size / 1024).toFixed(1)} KB
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={handleView} disabled={viewing}>
            <Eye />
            {viewing ? "Opening..." : "View"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download />
            {downloading ? "Downloading..." : "Download"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button type="button" variant="destructive">
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this document?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently delete {doc.file_name}. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
