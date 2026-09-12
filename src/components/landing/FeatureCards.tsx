import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Private & Secure",
    description:
      "Your documents stay private with authentication, database security, and protected storage.",
  },
  {
    title: "Family Organized",
    description:
      "Keep documents organized by family member so you can find what you need quickly.",
  },
  {
    title: "Access Anywhere",
    description:
      "Access important documents from your phone, laptop, or any device when you need them.",
  },
];

export function FeatureCards() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="text-left">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}