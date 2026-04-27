import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, CreditCard, Receipt, Heart, ArrowRight } from "lucide-react";

const calculators = [
  {
    icon: TrendingUp,
    title: "SIP Calculator",
    description: "Plan your systematic investment portfolio and calculate potential returns over time.",
    color: "bg-emerald-500",
    href: "/calculators#sip"
  },
  {
    icon: CreditCard,
    title: "EMI Calculator",
    description: "Calculate monthly installments for loans with interest rates and tenure options.",
    color: "bg-blue-500",
    href: "/calculators#emi"
  },
  {
    icon: Receipt,
    title: "Tax Calculator",
    description: "Compute income tax with interest, penalties, and late fee calculations included.",
    color: "bg-amber-500",
    href: "/calculators#tax"
  },
  {
    icon: Heart,
    title: "Insurance Premium",
    description: "Calculate premiums for LIC, GIC, and health insurance policies.",
    color: "bg-rose-500",
    href: "/calculators#insurance"
  }
];

export function CalculatorsPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Financial <span className="text-primary">Calculators</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Make informed financial decisions with our comprehensive suite of calculators.
            Plan investments, calculate EMIs, compute taxes, and estimate insurance premiums.
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {calculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${calc.color} text-white transition-transform group-hover:scale-110`}>
                <calc.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                  {calc.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {calc.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/calculators" className="gap-2">
              Explore All Calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
