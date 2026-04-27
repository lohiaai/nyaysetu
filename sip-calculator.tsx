"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, IndianRupee, Calendar, Percent } from "lucide-react";

export function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [result, setResult] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0
  });

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const r = expectedReturn / 100 / 12; // Monthly interest rate
    const n = timePeriod * 12; // Total months

    // SIP Future Value Formula: P × [(1 + r)^n - 1] / r × (1 + r)
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const investedAmount = P * n;
    const estimatedReturns = futureValue - investedAmount;

    setResult({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue)
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
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            SIP Calculator
          </CardTitle>
          <CardDescription>
            Calculate your Systematic Investment Plan returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Monthly Investment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Monthly Investment
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rs.</span>
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-28 text-right"
                  min={500}
                  max={1000000}
                />
              </div>
            </div>
            <Slider
              value={[monthlyInvestment]}
              onValueChange={(v) => setMonthlyInvestment(v[0])}
              min={500}
              max={100000}
              step={500}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rs. 500</span>
              <span>Rs. 1,00,000</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Expected Return (p.a.)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-20 text-right"
                  min={1}
                  max={30}
                  step={0.5}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[expectedReturn]}
              onValueChange={(v) => setExpectedReturn(v[0])}
              min={1}
              max={30}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Time Period */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-20 text-right"
                  min={1}
                  max={40}
                />
                <span className="text-sm text-muted-foreground">Years</span>
              </div>
            </div>
            <Slider
              value={[timePeriod]}
              onValueChange={(v) => setTimePeriod(v[0])}
              min={1}
              max={40}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
          <CardDescription>
            Your SIP returns after {timePeriod} years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Placeholder - Visual representation */}
          <div className="relative h-48 w-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={`${(result.investedAmount / result.totalValue) * 251.2} 251.2`}
                className="text-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={`${(result.estimatedReturns / result.totalValue) * 251.2} 251.2`}
                strokeDashoffset={`-${(result.investedAmount / result.totalValue) * 251.2}`}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">Total Value</span>
              <span className="text-lg font-bold">{formatCurrency(result.totalValue)}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Returns</span>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invested Amount</span>
              <span className="font-semibold text-secondary">{formatCurrency(result.investedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Returns</span>
              <span className="font-semibold text-primary">{formatCurrency(result.estimatedReturns)}</span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Value</span>
                <span className="text-xl font-bold">{formatCurrency(result.totalValue)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
