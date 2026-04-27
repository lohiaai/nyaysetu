"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Building2, User, Calendar, IndianRupee, Info } from "lucide-react";

// Premium factors (simplified for demonstration)
const ageFactor = (age: number) => {
  if (age < 25) return 0.8;
  if (age < 35) return 1.0;
  if (age < 45) return 1.3;
  if (age < 55) return 1.8;
  return 2.5;
};

export function InsuranceCalculator() {
  const [insuranceType, setInsuranceType] = useState("health");

  return (
    <div className="space-y-8">
      <Tabs value={insuranceType} onValueChange={setInsuranceType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="life" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Life (LIC)</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">General (GIC)</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <HealthInsuranceCalculator />
        </TabsContent>

        <TabsContent value="life" className="mt-6">
          <LifeInsuranceCalculator />
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <GeneralInsuranceCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HealthInsuranceCalculator() {
  const [age, setAge] = useState(30);
  const [sumInsured, setSumInsured] = useState(500000);
  const [members, setMembers] = useState(1);
  const [plan, setPlan] = useState("individual");
  const [result, setResult] = useState({ basePremium: 0, gst: 0, totalPremium: 0 });

  useEffect(() => {
    calculatePremium();
  }, [age, sumInsured, members, plan]);

  const calculatePremium = () => {
    // Base premium calculation (simplified)
    let basePremium = (sumInsured / 100000) * 1200; // Rs. 1200 per lakh
    
    // Age factor
    basePremium *= ageFactor(age);
    
    // Plan type factor
    if (plan === "family") {
      basePremium *= members * 0.7; // Family discount
    } else {
      basePremium *= members;
    }
    
    // GST (18%)
    const gst = basePremium * 0.18;
    const totalPremium = basePremium + gst;

    setResult({
      basePremium: Math.round(basePremium),
      gst: Math.round(gst),
      totalPremium: Math.round(totalPremium)
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Health Insurance Premium
          </CardTitle>
          <CardDescription>Calculate your health insurance premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Type */}
          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="family">Family Floater</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Age of Oldest Member
              </Label>
              <span className="font-medium">{age} years</span>
            </div>
            <Slider
              value={[age]}
              onValueChange={(v) => setAge(v[0])}
              min={18}
              max={65}
              step={1}
            />
          </div>

          {/* Sum Insured */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Sum Insured
              </Label>
              <span className="font-medium">{formatCurrency(sumInsured)}</span>
            </div>
            <Slider
              value={[sumInsured]}
              onValueChange={(v) => setSumInsured(v[0])}
              min={100000}
              max={5000000}
              step={100000}
            />
          </div>

          {/* Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Number of Members</Label>
              <span className="font-medium">{members}</span>
            </div>
            <Slider
              value={[members]}
              onValueChange={(v) => setMembers(v[0])}
              min={1}
              max={6}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle>Premium Estimate</CardTitle>
          <CardDescription>Annual premium for your health coverage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-rose-500 p-6 text-center text-white">
            <div className="text-sm opacity-90">Annual Premium</div>
            <div className="mt-2 text-3xl font-bold">{formatCurrency(result.totalPremium)}</div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Premium</span>
              <span className="font-medium">{formatCurrency(result.basePremium)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">{formatCurrency(result.gst)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Premium</span>
                <span className="text-xl font-bold">{formatCurrency(result.totalPremium)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This is an estimate. Actual premium may vary based on medical history, lifestyle, and insurer policies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LifeInsuranceCalculator() {
  const [age, setAge] = useState(30);
  const [sumAssured, setSumAssured] = useState(5000000);
  const [term, setTerm] = useState(20);
  const [planType, setPlanType] = useState("term");
  const [result, setResult] = useState({ premium: 0, gst: 0, total: 0 });

  useEffect(() => {
    calculatePremium();
  }, [age, sumAssured, term, planType]);

  const calculatePremium = () => {
    let baseRate = 0;
    
    // Premium rates per lakh per year (simplified)
    if (planType === "term") {
      baseRate = 8; // Rs. 8 per lakh for term
    } else if (planType === "endowment") {
      baseRate = 45; // Rs. 45 per lakh for endowment
    } else {
      baseRate = 35; // Rs. 35 per lakh for whole life
    }

    let premium = (sumAssured / 100000) * baseRate * ageFactor(age);
    
    // Term factor
    if (term > 20) premium *= 1.1;
    if (term > 30) premium *= 1.2;

    const gst = premium * 0.18;
    const total = premium + gst;

    setResult({
      premium: Math.round(premium),
      gst: Math.round(gst),
      total: Math.round(total)
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            LIC Premium Calculator
          </CardTitle>
          <CardDescription>Calculate your life insurance premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Type */}
          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Select value={planType} onValueChange={setPlanType}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term">Term Insurance</SelectItem>
                <SelectItem value="endowment">Endowment Plan</SelectItem>
                <SelectItem value="wholelife">Whole Life</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Your Age</Label>
              <span className="font-medium">{age} years</span>
            </div>
            <Slider
              value={[age]}
              onValueChange={(v) => setAge(v[0])}
              min={18}
              max={60}
              step={1}
            />
          </div>

          {/* Sum Assured */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sum Assured</Label>
              <span className="font-medium">{formatCurrency(sumAssured)}</span>
            </div>
            <Slider
              value={[sumAssured]}
              onValueChange={(v) => setSumAssured(v[0])}
              min={1000000}
              max={50000000}
              step={500000}
            />
          </div>

          {/* Policy Term */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Policy Term</Label>
              <span className="font-medium">{term} years</span>
            </div>
            <Slider
              value={[term]}
              onValueChange={(v) => setTerm(v[0])}
              min={10}
              max={40}
              step={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <CardHeader>
          <CardTitle>Premium Estimate</CardTitle>
          <CardDescription>Annual premium for {planType} insurance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-green-500 p-6 text-center text-white">
            <div className="text-sm opacity-90">Annual Premium</div>
            <div className="mt-2 text-3xl font-bold">{formatCurrency(result.total)}</div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Premium</span>
              <span className="font-medium">{formatCurrency(result.premium)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">{formatCurrency(result.gst)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-lg font-bold">{formatCurrency(sumAssured)}</div>
              <div className="text-xs text-muted-foreground">Sum Assured</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-lg font-bold">{term} Years</div>
              <div className="text-xs text-muted-foreground">Policy Term</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GeneralInsuranceCalculator() {
  const [insuranceCategory, setInsuranceCategory] = useState("vehicle");
  const [vehicleValue, setVehicleValue] = useState(500000);
  const [vehicleAge, setVehicleAge] = useState(0);
  const [result, setResult] = useState({ ownDamage: 0, thirdParty: 0, gst: 0, total: 0 });

  useEffect(() => {
    calculatePremium();
  }, [vehicleValue, vehicleAge, insuranceCategory]);

  const calculatePremium = () => {
    // Own Damage Premium (simplified)
    const depreciationFactor = 1 - (vehicleAge * 0.05); // 5% depreciation per year
    const idv = vehicleValue * Math.max(depreciationFactor, 0.5);
    const ownDamage = idv * 0.028; // 2.8% of IDV

    // Third Party (fixed rates)
    let thirdParty = 2094; // Base for private car
    if (vehicleValue > 1000000) thirdParty = 3416;
    if (vehicleValue > 2000000) thirdParty = 5000;

    const totalBeforeGst = ownDamage + thirdParty;
    const gst = totalBeforeGst * 0.18;
    const total = totalBeforeGst + gst;

    setResult({
      ownDamage: Math.round(ownDamage),
      thirdParty: Math.round(thirdParty),
      gst: Math.round(gst),
      total: Math.round(total)
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            GIC / Motor Insurance
          </CardTitle>
          <CardDescription>Calculate your vehicle insurance premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Insurance Type */}
          <div className="space-y-2">
            <Label>Insurance Type</Label>
            <Select value={insuranceCategory} onValueChange={setInsuranceCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle">Comprehensive</SelectItem>
                <SelectItem value="thirdparty">Third Party Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Value */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Vehicle Ex-showroom Price</Label>
              <span className="font-medium">{formatCurrency(vehicleValue)}</span>
            </div>
            <Slider
              value={[vehicleValue]}
              onValueChange={(v) => setVehicleValue(v[0])}
              min={100000}
              max={5000000}
              step={50000}
            />
          </div>

          {/* Vehicle Age */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Vehicle Age</Label>
              <span className="font-medium">{vehicleAge} years</span>
            </div>
            <Slider
              value={[vehicleAge]}
              onValueChange={(v) => setVehicleAge(v[0])}
              min={0}
              max={15}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle>Premium Estimate</CardTitle>
          <CardDescription>Annual motor insurance premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-blue-500 p-6 text-center text-white">
            <div className="text-sm opacity-90">Annual Premium</div>
            <div className="mt-2 text-3xl font-bold">{formatCurrency(result.total)}</div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Own Damage Premium</span>
              <span className="font-medium">{formatCurrency(result.ownDamage)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Third Party Liability</span>
              <span className="font-medium">{formatCurrency(result.thirdParty)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">{formatCurrency(result.gst)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Estimate based on standard rates. Actual premium depends on NCB, add-ons, and insurer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
