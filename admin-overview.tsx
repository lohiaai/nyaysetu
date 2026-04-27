"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Users, Eye, Calculator, Crown, TrendingUp, Activity } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  totalVisits: number;
  todayVisits: number;
  calculatorUsage: number;
  recentUsers: Array<{
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    is_premium: boolean;
  }>;
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();
    
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get premium users
      const { count: premiumUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("is_premium", true);

      // Get total visits
      const { count: totalVisits } = await supabase
        .from("user_visits")
        .select("*", { count: "exact", head: true });

      // Get today's visits
      const today = new Date().toISOString().split("T")[0];
      const { count: todayVisits } = await supabase
        .from("user_visits")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", today);

      // Get calculator usage
      const { count: calculatorUsage } = await supabase
        .from("calculator_usage")
        .select("*", { count: "exact", head: true });

      // Get recent users
      const { data: recentUsers } = await supabase
        .from("users")
        .select("id, email, full_name, created_at, is_premium")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        totalVisits: totalVisits || 0,
        todayVisits: todayVisits || 0,
        calculatorUsage: calculatorUsage || 0,
        recentUsers: recentUsers || []
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load statistics
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: Crown,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Total Visits",
      value: stats.totalVisits,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Today's Visits",
      value: stats.todayVisits,
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Calculator Usage",
      value: stats.calculatorUsage,
      icon: Calculator,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    },
    {
      title: "Conversion Rate",
      value: stats.totalUsers > 0 ? `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUsers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No users yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                      {user.full_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || "No name"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.is_premium && (
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                        Premium
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
