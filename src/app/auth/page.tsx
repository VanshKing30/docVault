import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to DocVault</CardTitle>
        </CardHeader>

        <CardContent>
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </main>
  );
}