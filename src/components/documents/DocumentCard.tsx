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
type Document = Database["public"]["Tables"]["documents"]["Row"];

type DocumentCardProps = {
  document: Document;
};

export function DocumentCard({ document }: DocumentCardProps) {
  const handleView = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.file_path, 300);

    if (error) {
      console.error("Error creating signed URL:", error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async () => {
    const supabase = createClient();

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.file_path]);

    if (storageError) {
      console.error("Error deleting file:", storageError);
      return;
    }

    const { error: databaseError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document.id);

    if (databaseError) {
      console.error("Error deleting document metadata:", databaseError);
      return;
    }

    console.log("Document deleted successfully");

    window.location.reload();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="break-words">{document.file_name}</CardTitle>
      </CardHeader>

      <CardContent>
        <Badge variant="secondary">{document.doc_type}</Badge>

        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">
            Size: {(document.file_size / 1024).toFixed(1)} KB
          </p>

          {document.expiry_date && (
            <p className="text-sm text-muted-foreground">
              Expires: {document.expiry_date}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={handleView}>
            View
          </Button>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this document?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently delete {document.file_name}. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
