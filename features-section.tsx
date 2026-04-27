import { 
  Scale, 
  Calculator, 
  Bot, 
  Image, 
  Video, 
  FileText, 
  Users, 
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Legal Assistant",
    description: "Get instant answers to your legal questions powered by advanced AI technology.",
    color: "primary"
  },
  {
    icon: Calculator,
    title: "Financial Calculators",
    description: "SIP, EMI, Tax, and Insurance premium calculators for smart financial planning.",
    color: "secondary"
  },
  {
    icon: Image,
    title: "AI Image Generator",
    description: "Create professional images from text descriptions using AI technology.",
    color: "accent"
  },
  {
    icon: Video,
    title: "AI Presentation Maker",
    description: "Generate engaging presentations and slideshows from your content.",
    color: "primary"
  },
  {
    icon: FileText,
    title: "Legal Documents",
    description: "Access templates and guidance for common legal documents.",
    color: "secondary"
  },
  {
    icon: Scale,
    title: "Legal Consultation",
    description: "Connect with experienced legal professionals in Northeast India.",
    color: "accent"
  },
  {
    icon: Users,
    title: "User Dashboard",
    description: "Track your consultations, calculations, and AI interactions in one place.",
    color: "primary"
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your information is protected with enterprise-grade security measures.",
    color: "secondary"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access AI tools and calculators anytime, anywhere, on any device.",
    color: "accent"
  }
];

const colorClasses = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  secondary: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need in{" "}
            <span className="text-primary">One Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            NyayaSetu combines legal expertise with cutting-edge AI technology 
            to provide comprehensive solutions for your legal and business needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
