import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type FamilyMember =
  Database["public"]["Tables"]["family_members"]["Row"];

type MemberCardProps = {
  member: FamilyMember;
};

export function MemberCard({ member }: MemberCardProps) {
  return (
  <Link href={`/dashboard/${member.id}`}>
    <Card className="cursor-pointer transition hover:shadow-md">
      <CardHeader>
        <CardTitle>{member.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {member.relationship}
        </p>
      </CardContent>
    </Card>
  </Link>
);
}