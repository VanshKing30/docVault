"use client";

import { useDocuments } from "@/hooks/useDocuments";
import { DocumentCard } from "@/components/documents/DocumentCard";

type DocumentListProps = {
  familyMemberId: string;
};

export function DocumentList({
  familyMemberId,
}: DocumentListProps) {
  const { documents, loading } = useDocuments(familyMemberId);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading documents...
      </p>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
  {documents.map((document) => (
    <DocumentCard key={document.id} document={document} />
  ))}
</div>
  );
}