"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, IndianRupee, AlertTriangle, Info } from "lucide-react";

// Tax slabs for FY 2024-25
const oldRegimeSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

const newRegimeSlabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

export function TaxCalculator() {
  const [regime, setRegime] = useState<"old" | "new">("new");
  const [grossIncome, setGrossIncome] = useState(1000000);
  const [deductions, setDeductions] = useState({
    section80C: 150000,
    section80D: 25000,
    hra: 0,
    standardDeduction: 50000,
    other: 0
  });
  const [lateFiling, setLateFiling] = useState(false);
  const [delayMonths, setDelayMonths] = useState(0);
  const [result, setResult] = useState({
    taxableIncome: 0,
    basicTax: 0,
    surcharge: 0,
    cess: 0,
    interest: 0,
    lateFee: 0,
    totalTax: 0
  });

  useEffect(() => {
    calculateTax();
  }, [regime, grossIncome, deductions, lateFiling, delayMonths]);

  const calculateTax = () => {
    let taxableIncome = grossIncome;
    
    // Apply deductions based on regime
    if (regime === "old") {
      taxableIncome -= deductions.standardDeduction;
      taxableIncome -= Math.min(deductions.section80C, 150000);
      taxableIncome -= Math.min(deductions.section80D, 100000);
      taxableIncome -= deductions.hra;
      taxableIncome -= deductions.other;
    } else {
      // New regime only has standard deduction
      taxableIncome -= 75000; // Standard deduction for new regime
    }

    taxableIncome = Math.max(0, taxableIncome);

    // Calculate basic tax
    const slabs = regime === "old" ? oldRegimeSlabs : newRegimeSlabs;
    let basicTax = 0;
    let remainingIncome = taxableIncome;

    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      
      const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min + 1);
      if (remainingIncome > slab.min) {
        basicTax += taxableInSlab * (slab.rate / 100);
        remainingIncome -= taxableInSlab;
      }
    }

    // Rebate under section 87A (New regime: up to 7L, Old regime: up to 5L)
    if (regime === "new" && taxableIncome <= 700000) {
      basicTax = Math.max(0, basicTax - 25000);
    } else if (regime === "old" && taxableIncome <= 500000) {
      basicTax = Math.max(0, basicTax - 12500);
    }

    // Surcharge calculation
    let surcharge = 0;
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      surcharge = basicTax * 0.1;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      surcharge = basicTax * 0.15;
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      surcharge = basicTax * 0.25;
    } else if (taxableIncome > 50000000) {
      surcharge = basicTax * 0.37;
    }

    // Health & Education Cess (4%)
    const cess = (basicTax + surcharge) * 0.04;

    // Interest on late payment (1% per month under 234A, 234B, 234C)
    let interest = 0;
    if (lateFiling && delayMonths > 0) {
      // Simplified interest calculation
      interest = (basicTax + surcharge + cess) * 0.01 * delayMonths;
    }

    // Late filing fee (Section 234F)
    let lateFee = 0;
    if (lateFiling) {
      if (grossIncome <= 500000) {
        lateFee = 1000;
      } else {
        lateFee = delayMonths > 3 ? 10000 : 5000;
      }
    }

    const totalTax = basicTax + surcharge + cess + interest + lateFee;

    setResult({
      taxableIncome: Math.round(taxableIncome),
      basicTax: Math.round(basicTax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      interest: Math.round(interest),
      lateFee: Math.round(lateFee),
      totalTax: Math.round(totalTax)
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Regime Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-amber-500" />
            Income Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate your income tax for FY 2024-25 (AY 2025-26)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={regime} onValueChange={(v) => setRegime(v as "old" | "new")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Tax Regime</TabsTrigger>
              <TabsTrigger value="old">Old Tax Regime</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-4">
            <Info className="h-5 w-5 shrink-0 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              {regime === "new" 
                ? "New regime offers lower tax rates but limited deductions. Standard deduction of Rs. 75,000 is allowed."
                : "Old regime allows multiple deductions under 80C, 80D, HRA, etc. but has higher tax rates."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Income & Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gross Income */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Gross Annual Income
              </Label>
              <Input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="text-right"
                min={0}
              />
            </div>

            {regime === "old" && (
              <>
                {/* Section 80C */}
                <div className="space-y-2">
                  <Label>Section 80C (PPF, ELSS, LIC, etc.)</Label>
                  <Input
                    type="number"
                    value={deductions.section80C}
                    onChange={(e) => setDeductions({...deductions, section80C: Number(e.target.value)})}
                    className="text-right"
                    max={150000}
                  />
                  <p className="text-xs text-muted-foreground">Max: Rs. 1,50,000</p>
                </div>

                {/* Section 80D */}
                <div className="space-y-2">
                  <Label>Section 80D (Health Insurance)</Label>
                  <Input
                    type="number"
                    value={deductions.section80D}
                    onChange={(e) => setDeductions({...deductions, section80D: Number(e.target.value)})}
                    className="text-right"
                    max={100000}
                  />
                </div>

                {/* HRA */}
                <div className="space-y-2">
                  <Label>HRA Exemption</Label>
                  <Input
                    type="number"
                    value={deductions.hra}
                    onChange={(e) => setDeductions({...deductions, hra: Number(e.target.value)})}
                    className="text-right"
                  />
                </div>

                {/* Other Deductions */}
                <div className="space-y-2">
                  <Label>Other Deductions</Label>
                  <Input
                    type="number"
                    value={deductions.other}
                    onChange={(e) => setDeductions({...deductions, other: Number(e.target.value)})}
                    className="text-right"
                  />
                </div>
              </>
            )}

            {/* Late Filing */}
            <div className="space-y-4 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Late Filing
                </Label>
                <Switch checked={lateFiling} onCheckedChange={setLateFiling} />
              </div>

              {lateFiling && (
                <div className="space-y-2">
                  <Label>Delay in Months</Label>
                  <Input
                    type="number"
                    value={delayMonths}
                    onChange={(e) => setDelayMonths(Number(e.target.value))}
                    className="text-right"
                    min={0}
                    max={36}
                  />
                  <p className="text-xs text-muted-foreground">
                    Interest @1% per month + Late fee applies
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <CardHeader>
            <CardTitle>Tax Calculation</CardTitle>
            <CardDescription>Your income tax breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Box */}
            <div className="rounded-xl bg-amber-500 p-6 text-center text-white">
              <div className="text-sm opacity-90">Total Tax Payable</div>
              <div className="mt-2 text-3xl font-bold">{formatCurrency(result.totalTax)}</div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxable Income</span>
                <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Basic Tax</span>
                <span className="font-medium">{formatCurrency(result.basicTax)}</span>
              </div>
              {result.surcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Surcharge</span>
                  <span className="font-medium">{formatCurrency(result.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Health & Education Cess (4%)</span>
                <span className="font-medium">{formatCurrency(result.cess)}</span>
              </div>
              {result.interest > 0 && (
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Interest (Section 234)</span>
                  <span className="font-medium">{formatCurrency(result.interest)}</span>
                </div>
              )}
              {result.lateFee > 0 && (
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Late Filing Fee (234F)</span>
                  <span className="font-medium">{formatCurrency(result.lateFee)}</span>
                </div>
              )}
            </div>

            {/* Tax Slabs Info */}
            <div className="space-y-2">
              <h4 className="font-medium">Tax Slabs ({regime === "new" ? "New" : "Old"} Regime)</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                {(regime === "new" ? newRegimeSlabs : oldRegimeSlabs).map((slab, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {slab.max === Infinity 
                        ? `Above ${formatCurrency(slab.min)}`
                        : `${formatCurrency(slab.min)} - ${formatCurrency(slab.max)}`
                      }
                    </span>
                    <span>{slab.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
