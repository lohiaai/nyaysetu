"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, CreditCard, Receipt, Heart, Calculator } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface CalculatorUsage {
  type: string;
  count: number;
  lastUsed: string | null;
}

const calculatorIcons: Record<string, typeof Calculator> = {
  sip: TrendingUp,
  emi: CreditCard,
  tax: Receipt,
  insurance: Heart
};

const calculatorNames: Record<string, string> = {
  sip: "SIP Calculator",
  emi: "EMI Calculator",
  tax: "Tax Calculator",
  insurance: "Insurance Calculator"
};

export function CalculatorStats() {
  const [usage, setUsage] = useState<CalculatorUsage[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    const supabase = createClient();
    
    // Get all calculator usage
    const { data, error } = await supabase
      .from("calculator_usage")
      .select("calculator_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching calculator usage:", error);
      setLoading(false);
      return;
    }

    // Aggregate by type
    const usageMap: Record<string, { count: number; lastUsed: string | null }> = {
      sip: { count: 0, lastUsed: null },
      emi: { count: 0, lastUsed: null },
      tax: { count: 0, lastUsed: null },
      insurance: { count: 0, lastUsed: null }
    };

    data?.forEach(item => {
      const type = item.calculator_type;
      if (usageMap[type]) {
        usageMap[type].count++;
        if (!usageMap[type].lastUsed) {
          usageMap[type].lastUsed = item.created_at;
        }
      }
    });

    const usageArray = Object.entries(usageMap).map(([type, stats]) => ({
      type,
      count: stats.count,
      lastUsed: stats.lastUsed
    }));

    setUsage(usageArray);
    setTotalUsage(data?.length || 0);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Usage */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Calculator Usage</p>
            <p className="text-3xl font-bold">{totalUsage}</p>
          </div>
        </CardContent>
      </Card>

      {/* Usage by Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        {usage.map((calc) => {
          const Icon = calculatorIcons[calc.type] || Calculator;
          const name = calculatorNames[calc.type] || calc.type;
          const percentage = totalUsage > 0 ? ((calc.count / totalUsage) * 100).toFixed(1) : 0;

          return (
            <Card key={calc.type}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {name}
                  </CardTitle>
                  <span className="text-2xl font-bold">{calc.count}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress bar */}
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{percentage}% of total</span>
                  {calc.lastUsed && (
                    <span>Last: {new Date(calc.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p className="text-sm">
            Calculator usage is tracked automatically when users interact with the calculators.
            This helps understand which financial tools are most popular.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
