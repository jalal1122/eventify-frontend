"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Users, Building2, Calendar, Ticket } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Attendees",
      value: data.totalAttendees.toLocaleString(),
      icon: Users,
    },
    {
      name: "Total Organizers",
      value: data.totalOrganizers.toLocaleString(),
      icon: Building2,
    },
    {
      name: "Live Events",
      value: data.liveEvents.toLocaleString(),
      icon: Calendar,
    },
    {
      name: "Total Registrations",
      value: data.totalRegistrations.toLocaleString(),
      icon: Ticket,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          Platform Analytics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          In-depth metrics and trends across the Eventify platform.
        </p>
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 border border-gray-100 flex items-center gap-4"
          >
            <div className="rounded-md bg-teal-50 p-3 flex-shrink-0">
              <item.icon className="h-6 w-6 text-teal-600" aria-hidden="true" />
            </div>
            <div>
              <p className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </dl>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">
            User & Event Growth (30 Days)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.timeSeries}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Line
                  type="monotone"
                  dataKey="attendees"
                  name="Attendees"
                  stroke="#0D7490"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  name="Events"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Cities */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">
              Top Cities
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.cities}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    stroke="#4B5563"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip cursor={{ fill: "#F3F4F6" }} />
                  <Bar
                    dataKey="count"
                    fill="#0D7490"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {data.cities.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
              Event Categories
            </h3>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {data.categories.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
