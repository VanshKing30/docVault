import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div>
          <span className="text-xl font-bold">DocVault</span>
        </div>

        <Button>Get Started</Button>
      </nav>
    </header>
  );
}