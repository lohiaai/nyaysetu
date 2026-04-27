"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download, Globe, Clock, User, Monitor } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Visit {
  id: string;
  user_id: string | null;
  visited_at: string;
  page_path: string | null;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
  user?: {
    email: string;
    full_name: string | null;
  };
}

interface VisitStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  topPages: Array<{ page: string; count: number }>;
}

export function VisitsAnalytics() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const supabase = createClient();
    
    // Fetch recent visits
    const { data: visitsData } = await supabase
      .from("user_visits")
      .select(`
        *,
        user:users(email, full_name)
      `)
      .order("visited_at", { ascending: false })
      .limit(50);

    // Get stats
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: total } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true });

    const { count: todayCount } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", today);

    const { count: weekCount } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", weekAgo);

    const { count: monthCount } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", monthAgo);

    // Get top pages (simplified - in production use aggregate query)
    const pageVisits: Record<string, number> = {};
    visitsData?.forEach(visit => {
      const page = visit.page_path || "/";
      pageVisits[page] = (pageVisits[page] || 0) + 1;
    });

    const topPages = Object.entries(pageVisits)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setVisits(visitsData || []);
    setStats({
      total: total || 0,
      today: todayCount || 0,
      thisWeek: weekCount || 0,
      thisMonth: monthCount || 0,
      topPages
    });
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["Date", "User", "Page", "Referrer", "IP"];
    const rows = visits.map(visit => [
      new Date(visit.visited_at).toLocaleString(),
      visit.user?.email || "Anonymous",
      visit.page_path || "/",
      visit.referrer || "-",
      visit.ip_address || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nyayasetu-visits-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Mobile")) return "Mobile";
    if (ua.includes("Tablet")) return "Tablet";
    return "Desktop";
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
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-3xl font-bold text-green-500">{stats.today}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold text-blue-500">{stats.thisWeek}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-purple-500">{stats.thisMonth}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Pages */}
      {stats && stats.topPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{page.page}</span>
                  </div>
                  <span className="font-medium">{page.count} visits</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Visits Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Last 50 page visits</CardDescription>
            </div>
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No visits recorded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead className="hidden md:table-cell">Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {new Date(visit.visited_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {visit.user?.email || "Anonymous"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{visit.page_path || "/"}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Monitor className="h-3 w-3" />
                          {parseUserAgent(visit.user_agent)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
