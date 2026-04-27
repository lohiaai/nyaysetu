import Link from "next/link";
import { Scale, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/calculators", label: "Calculators" },
    { href: "/ai-assistant", label: "AI Legal Assistant" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "#features", label: "Features" },
  ];

  const projects = [
    { href: "https://v0-upsc-exam-prep.vercel.app", label: "UPSC Exam Prep", external: true },
    { href: "https://v0-ek-dating-website-clone.vercel.app", label: "EK Dating Clone", external: true },
  ];

  const calculators = [
    { href: "/calculators#sip", label: "SIP Calculator" },
    { href: "/calculators#emi", label: "EMI Calculator" },
    { href: "/calculators#tax", label: "Tax Calculator" },
    { href: "/calculators#insurance", label: "Insurance Premium" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Nyaya</span>
                <span className="text-secondary">Setu</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bridging the gap between law and people. Your trusted partner for legal services, 
              financial tools, and AI-powered assistance in Northeast India.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:advlakhilohia@gmail.com" className="hover:text-primary">
                  advlakhilohia@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Northeast India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Calculators */}
          <div className="space-y-4">
            <h3 className="font-semibold">Calculators</h3>
            <ul className="space-y-2">
              {calculators.map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {calc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Projects */}
          <div className="space-y-4">
            <h3 className="font-semibold">Our Projects</h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.href}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {project.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} NyayaSetu. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <span className="font-medium text-primary">Adv. Lakhi Lohia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
