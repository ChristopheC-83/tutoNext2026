"use client";

import { StatsResponse } from "@/types";
import { PieChart, ResponsiveContainer, Tooltip, Pie, Cell, Legend } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#6C4675", "#D36E70"];

export default function InvoicesStatusChart({ data }: { data: StatsResponse }) {
  	return (
		<div className="p-4 rounded-2xl shadow-2xl bg-white">
			<h1 className="text-lg font-semibold mb-4">Invoices status distribution</h1>
			<ResponsiveContainer width={"100%"} height={300}>
				<PieChart>
					<Pie
						data={data?.countByStatus}
						dataKey={"count"}
						nameKey={"status"}
						outerRadius={"90%"}
						label={(entry) => `${entry.value}`}
					>
						{data?.countByStatus.map((_, index) => (
							<Cell key={index} fill={COLORS[index]} />
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

