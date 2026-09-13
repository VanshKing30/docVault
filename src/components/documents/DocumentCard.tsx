import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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
        <CardTitle>{document.file_name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Type: {document.doc_type}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Size: {(document.file_size / 1024).toFixed(1)} KB
        </p>

        {document.expiry_date && (
          <p className="mt-1 text-sm text-muted-foreground">
            Expires: {document.expiry_date}
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={handleView}>
            View
          </Button>

          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
