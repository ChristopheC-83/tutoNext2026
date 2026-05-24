"use client";

import { StatsResponse } from "@/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TopClientsChart({ data }: { data: StatsResponse }) {
  return (
    <div className="p-4 rounded-2xl shadow-2xl bg-white">
      <h1 className="text-lg font-semibold mb-4">Top clients</h1>
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart data={data?.revenueByClient}>
          <XAxis dataKey={"name"} />
          <YAxis dataKey={"revenue"} />
          <Tooltip />
          <Bar dataKey={"revenue"} fill="#6366f1" radius={[4,4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
