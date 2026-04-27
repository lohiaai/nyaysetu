"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, IndianRupee, Calendar, Percent, Home, Car, GraduationCap, Briefcase } from "lucide-react";

const loanTypes = [
  { value: "home", label: "Home Loan", icon: Home, defaultRate: 8.5 },
  { value: "car", label: "Car Loan", icon: Car, defaultRate: 9.5 },
  { value: "education", label: "Education Loan", icon: GraduationCap, defaultRate: 10.5 },
  { value: "personal", label: "Personal Loan", icon: Briefcase, defaultRate: 12 },
];

export function EMICalculator() {
  const [loanType, setLoanType] = useState("home");
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  useEffect(() => {
    const loan = loanTypes.find(l => l.value === loanType);
    if (loan) {
      setInterestRate(loan.defaultRate);
    }
  }, [loanType]);

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 100 / 12; // Monthly interest rate
    const n = tenure * 12; // Total months

    // EMI Formula: P × r × (1 + r)^n / [(1 + r)^n - 1]
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    setResult({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} L`;
    }
    return value.toLocaleString("en-IN");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            EMI Calculator
          </CardTitle>
          <CardDescription>
            Calculate your Equated Monthly Installment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Loan Type */}
          <div className="space-y-3">
            <Label>Loan Type</Label>
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {loanTypes.map((loan) => (
                  <SelectItem key={loan.value} value={loan.value}>
                    <div className="flex items-center gap-2">
                      <loan.icon className="h-4 w-4" />
                      {loan.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loan Amount */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Loan Amount
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rs.</span>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-32 text-right"
                  min={100000}
                  max={100000000}
                />
              </div>
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={(v) => setLoanAmount(v[0])}
              min={100000}
              max={100000000}
              step={100000}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 Lakh</span>
              <span>10 Crore</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Interest Rate (p.a.)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-20 text-right"
                  min={1}
                  max={30}
                  step={0.1}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={(v) => setInterestRate(v[0])}
              min={1}
              max={30}
              step={0.1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Loan Tenure
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-20 text-right"
                  min={1}
                  max={30}
                />
                <span className="text-sm text-muted-foreground">Years</span>
              </div>
            </div>
            <Slider
              value={[tenure]}
              onValueChange={(v) => setTenure(v[0])}
              min={1}
              max={30}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle>EMI Breakdown</CardTitle>
          <CardDescription>
            Your loan repayment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EMI Highlight */}
          <div className="rounded-xl bg-blue-500 p-6 text-center text-white">
            <div className="text-sm opacity-90">Monthly EMI</div>
            <div className="mt-2 text-3xl font-bold">{formatCurrency(result.emi)}</div>
          </div>

          {/* Breakdown Bar */}
          <div className="space-y-3">
            <div className="h-8 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{ width: `${(loanAmount / result.totalAmount) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Principal ({((loanAmount / result.totalAmount) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <span className="text-muted-foreground">Interest ({((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Principal Loan Amount</span>
              <span className="font-semibold">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Interest</span>
              <span className="font-semibold text-amber-500">{formatCurrency(result.totalInterest)}</span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount Payable</span>
                <span className="text-xl font-bold">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold">{formatNumber(loanAmount)}</div>
              <div className="text-xs text-muted-foreground">Loan Amount</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold">{tenure * 12}</div>
              <div className="text-xs text-muted-foreground">Total EMIs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
