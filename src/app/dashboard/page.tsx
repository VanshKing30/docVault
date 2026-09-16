import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemberCard } from "@/components/family/MemberCard";
import { AddMemberModal } from "@/components/family/AddMemberModal";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: members, error } = await supabase
    .from("family_members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching family members:", error);
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">DocVault Dashboard</h1>

            <p className="mt-2 text-muted-foreground">Welcome, {user.email}</p>
          </div>

          <LogoutButton />
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Family Members</h2>
          <div className="mt-4">
            <AddMemberModal />
          </div>

          {members && members.length > 0 ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
  <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
    <h3 className="text-lg font-semibold">
      No family members yet
    </h3>

    <p className="mt-2 text-sm text-muted-foreground">
      Add your first family member to start organizing their documents.
    </p>

    <div className="mt-4">
      <AddMemberModal />
    </div>
  </div>
)}
        </section>
      </div>
    </main>
  );
}
