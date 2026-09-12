import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeatureCards } from "@/components/landing/FeatureCards";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center px-6 py-20 text-center">
        <div className="flex max-w-3xl flex-col items-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Your family documents.
            <br />
            <span className="text-primary">Safe. Simple. Accessible.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            DocVault gives your family one secure place to store, organize,
            and access important documents whenever you need them.
          </p>

          <div className="mt-8">
            <Button size="lg">Get Started</Button>
          </div>
        </div>

        <Card className="mt-12 w-full max-w-md text-left">
          <CardHeader>
            <CardTitle>Everything in one place</CardTitle>
            <CardDescription>
              Keep important family documents organized and easy to access.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button>Get Started</Button>
          </CardContent>
        </Card>

        <div className="mt-12 w-full">
          <FeatureCards />
        </div>
      </section>
    </main>
  );
}