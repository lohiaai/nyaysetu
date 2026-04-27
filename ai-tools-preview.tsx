import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Image, Presentation, ArrowRight, Sparkles } from "lucide-react";

const aiTools = [
  {
    icon: Bot,
    title: "AI Legal Assistant",
    description: "Get instant answers to legal questions. Our AI understands Indian law and provides helpful guidance.",
    href: "/ai-assistant",
    badge: "Free"
  },
  {
    icon: Image,
    title: "Text to Image",
    description: "Generate professional images from text descriptions using advanced AI image generation.",
    href: "/ai-tools#image",
    badge: "Premium"
  },
  {
    icon: Presentation,
    title: "AI Presentation Maker",
    description: "Create engaging slideshows and presentations from your text content automatically.",
    href: "/ai-tools#presentation",
    badge: "Free"
  }
];

export function AIToolsPreview() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by AI
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            AI-Powered <span className="text-primary">Tools</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Leverage the power of artificial intelligence to get legal assistance, 
            generate images, and create presentations effortlessly.
          </p>
        </div>

        {/* AI Tools Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {aiTools.map((tool, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {/* Badge */}
              <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                tool.badge === "Free" 
                  ? "bg-secondary/10 text-secondary" 
                  : "bg-primary/10 text-primary"
              }`}>
                {tool.badge}
              </div>

              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <tool.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold">{tool.title}</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              {/* Link */}
              <Link
                href={tool.href}
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                Try Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/ai-tools" className="gap-2">
              Explore All AI Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
