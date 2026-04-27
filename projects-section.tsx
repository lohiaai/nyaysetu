import { ExternalLink, GraduationCap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    icon: GraduationCap,
    title: "UPSC Exam Prep",
    description: "Comprehensive UPSC exam preparation platform with study materials, mock tests, and AI-powered learning assistance.",
    href: "https://v0-upsc-exam-prep.vercel.app",
    tags: ["Education", "AI Learning", "Exam Prep"]
  },
  {
    icon: Heart,
    title: "EK Dating Clone",
    description: "A modern dating platform clone with matchmaking features, chat functionality, and user profiles.",
    href: "https://v0-ek-dating-website-clone.vercel.app",
    tags: ["Social", "Matchmaking", "Chat"]
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Other <span className="text-secondary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Explore our portfolio of innovative web applications built with 
            modern technologies and AI capabilities.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-secondary/50 hover:shadow-xl"
            >
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-secondary shadow-lg backdrop-blur">
                  <project.icon className="h-8 w-8" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="mb-3 text-2xl font-semibold">{project.title}</h3>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Button asChild variant="secondary" className="gap-2">
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    Visit Project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
