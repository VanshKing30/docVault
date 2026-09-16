import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { DocumentList } from "@/components/documents/DocumentList";
import { UploadDocumentModal } from "@/components/documents/UploadDocumentModal";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type MemberPageProps = {
  params: Promise<{
    memberId: string;
  }>;
};

export default async function MemberPage({ params }: MemberPageProps) {
  const { memberId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: member, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("id", memberId)
    .single();

  if (error || !member) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
       <Link
  href="/dashboard"
  className="inline-flex min-h-10 items-center rounded-md px-3 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
>
  ← Family Members
</Link>
        <h1 className="text-3xl font-bold">{member.name}</h1>

        <p className="mt-2 text-muted-foreground">{member.relationship}</p>
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Documents</h2>

          <div className="mt-4 space-y-4">
            <UploadDocumentModal familyMemberId={member.id} />
            <DocumentList familyMemberId={member.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
