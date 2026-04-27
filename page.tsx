"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIPCalculator } from "@/components/calculators/sip-calculator";
import { EMICalculator } from "@/components/calculators/emi-calculator";
import { TaxCalculator } from "@/components/calculators/tax-calculator";
import { InsuranceCalculator } from "@/components/calculators/insurance-calculator";
import { TrendingUp, CreditCard, Receipt, Heart } from "lucide-react";

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("sip");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Financial <span className="text-primary">Calculators</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Make informed financial decisions with our comprehensive suite of calculators.
            </p>
          </div>

          {/* Calculator Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="sip" className="gap-2" id="sip">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">SIP</span>
              </TabsTrigger>
              <TabsTrigger value="emi" className="gap-2" id="emi">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">EMI</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="gap-2" id="tax">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Tax</span>
              </TabsTrigger>
              <TabsTrigger value="insurance" className="gap-2" id="insurance">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Insurance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sip" className="mt-8">
              <SIPCalculator />
            </TabsContent>

            <TabsContent value="emi" className="mt-8">
              <EMICalculator />
            </TabsContent>

            <TabsContent value="tax" className="mt-8">
              <TaxCalculator />
            </TabsContent>

            <TabsContent value="insurance" className="mt-8">
              <InsuranceCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
