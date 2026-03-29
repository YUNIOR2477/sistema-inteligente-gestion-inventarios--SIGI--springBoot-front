import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  House,
} from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/Product";
import type { Metrics } from "@/types/User";
import { useUserStore } from "@/store/useUserStore";
import ToastMessage from "./ToastMessage";
import type { ApiError } from "@/types/Response";

export const Dashboard = () => {
  const { metricsResponse, fetchMetrics, metricsIsLoading } = useUserStore();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    localStorage.setItem("navigationBar", "");
    localStorage.setItem("navigationTitle", "");

    const fetchDataMetrics = async () => {
      try {
        if (metricsResponse !== null) {
          setMetrics(metricsResponse?.data);
        } else {
          const response = await fetchMetrics();
          if (response !== null) setMetrics(response.data);
        }
      }
      catch (error: unknown) {
        const apiError = error as ApiError;
        ToastMessage({
          type: "error",
          title: apiError.title,
          description: apiError.description,
        });
      }
    };
    fetchDataMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barGraph = metrics
    ? [
      {
        name: "Orders",
        totalOrdersDraft: metrics.totalOrdersDraft,
        totalOrdersConfirmed: metrics.totalOrdersConfirmed,
        totalOrdersPending: metrics.totalOrdersPending,
        totalOrdersDelivered: metrics.totalOrdersDelivered,
        totalOrdersCanceled: metrics.totalOrdersCanceled,
      },
    ]
    : [];

  const pieGraph = metrics
    ? [
      { name: "Draft Orders", value: metrics.totalOrdersDraft, color: "#6b7280" },
      { name: "Confirmed Orders", value: metrics.totalOrdersConfirmed, color: "#10b981" },
      { name: "Pending Orders", value: metrics.totalOrdersPending, color: "#facc15" },
      { name: "Delivered Orders", value: metrics.totalOrdersDelivered, color: "#3b82f6" },
      { name: "Canceled Orders", value: metrics.totalOrdersCanceled, color: "#9333ea" },
    ]
    : [];

  return (
    <div className="flex flex-col gap-6 p-11 text-primary">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-medium">📦 SIGI Dashboard</h1>
        <p className="text-sm text-primary/70 mt-1">
          Updated on {dayjs().format("DD MMM YYYY")} ·{" "}
          {metrics?.totalProducts || 0} products registered
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {metricsIsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-12" />
            </Card>
          ))
        ) : (
          <>
            <Card className={`flex justify-center items-center text-primary bg-indigo-500/80`}>
              <div className="text-2xl">{<Package />}</div>
              <h3 className="text-base font-semibold mt-2">Products - Inventories</h3>
              <p className="text-xl font-medium">{metrics?.totalProducts} - {metrics?.totalInventories}</p>
            </Card>
            <KPI title="Warehouses" icon={<House />} value={metrics?.totalWarehouses} color="bg-teal-500/80" />
            <KPI title="Low Stock" icon={<AlertTriangle />} value={metrics?.totalLoWStock} color="bg-red-500/80" />
            <KPI title="Draft Orders" icon={<ClipboardList />} value={metrics?.totalOrdersDraft} color="bg-slate-500/80" />
            <KPI title="Confirmed Orders" icon={<CheckCircle />} value={metrics?.totalOrdersConfirmed} color="bg-green-500/80" />
            <KPI title="Pending Orders" icon={<Clock />} value={metrics?.totalOrdersPending} color="bg-yellow-500/80" />
            <KPI title="Delivered Orders" icon={<Truck />} value={metrics?.totalOrdersDelivered} color="bg-blue-500/80" />
            <KPI title="Canceled Orders" icon={<XCircle />} value={metrics?.totalOrdersCanceled} color="bg-purple-500/80" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 shadow-md bg-background/60">
          <h2 className="text-xl font-semibold mb-4">📉 Orders Status</h2>
          {metricsIsLoading ? (
            <Skeleton className="h-75 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barGraph}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalOrdersDraft" fill="#6b7280" />
                <Bar dataKey="totalOrdersConfirmed" fill="#10b981" />
                <Bar dataKey="totalOrdersPending" fill="#facc15" />
                <Bar dataKey="totalOrdersDelivered" fill="#3b82f6" />
                <Bar dataKey="totalOrdersCanceled" fill="#9333ea" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6 shadow-md bg-background/60">
          <h2 className="text-xl font-semibold mb-4">📈 Orders Distribution</h2>
          {metricsIsLoading ? (
            <Skeleton className="h-75 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieGraph.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-6 shadow-md bg-background/60">
        <h2 className="text-xl font-semibold mb-4">🆕 Latest Products Added</h2>
        {metricsIsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.latestProductsAdded?.slice(0, 6).map((p: Product) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.unit}</td>
                    <td className="py-2">{p.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

interface KPIProps {
  title: string;
  value?: number;
  icon: ReactNode;
  color: string;
}

const KPI: React.FC<KPIProps> = ({ title, value = 0, icon, color }) => (
  <Card className={`flex flex-col justify-center items-center p-5 text-primary ${color}`}>
    <div className="text-2xl">{icon}</div>
    <h3 className="text-base font-semibold mt-2">{title}</h3>
    <p className="text-xl font-medium">{value}</p>
  </Card>
);
