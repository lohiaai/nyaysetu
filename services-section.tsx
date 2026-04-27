import { Scale, Building, FileText, Users, Gavel, Home } from "lucide-react";

const services = [
  {
    icon: Scale,
    title: "Civil Litigation",
    description: "Expert representation in civil disputes, property matters, and contractual disagreements."
  },
  {
    icon: Building,
    title: "Corporate Law",
    description: "Business formation, compliance, contracts, and corporate governance advisory."
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Legal drafting, agreement preparation, and document verification services."
  },
  {
    icon: Users,
    title: "Family Law",
    description: "Matrimonial disputes, custody matters, inheritance, and succession planning."
  },
  {
    icon: Gavel,
    title: "Criminal Defense",
    description: "Legal representation and defense in criminal proceedings and investigations."
  },
  {
    icon: Home,
    title: "Property Law",
    description: "Real estate transactions, title verification, and property dispute resolution."
  }
];

export function ServicesSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Professional <span className="text-secondary">Legal Services</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Comprehensive legal services across Northeast India, backed by 
            experienced professionals dedicated to your success.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-secondary/50 hover:shadow-lg"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need legal assistance? Contact us at{" "}
            <a href="mailto:advlakhilohia@gmail.com" className="font-medium text-primary hover:underline">
              advlakhilohia@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
