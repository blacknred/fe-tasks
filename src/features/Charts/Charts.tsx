import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./Charts.module.css";
import { useSensors } from "./api/getSensors";
import type { ISensor } from "./types";

export function Charts() {
  const [chartKind, setChartKind] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [data, setData] = useState<ISensor[]>([]);

  const { isConnected, disconnect, connect } = useSensors({
    onMessage: (data) => setData((prev) => [...prev, data]),
  });

  function renderChart() {
    switch (chartKind) {
      case 1:
        return (
          <LineChart data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        );
      case 2:
        return (
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey="uv"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
          </AreaChart>
        );
      case 3:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="pv"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="uv"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        );

      case 4:
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="uv"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
            />
            <Pie
              data={data}
              dataKey="pv"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label
            />
          </PieChart>
        );

      case 5:
        return (
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={data}
          >
            <RadialBar
              // minAngle={15}
              label={{ position: "insideStart", fill: "#fff" }}
              background
              // clockWise
              dataKey="uv"
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
          </RadialBarChart>
        );
      default:
        return <></>;
    }
  }

  return (
    <>
      <h1>Charts</h1>
      <header className={styles.header}>
        <button className={chartKind === 1 ? styles.active : undefined} onClick={() => setChartKind(1)}>LineChart</button>
        <button className={chartKind === 2 ? styles.active : undefined} onClick={() => setChartKind(2)}>AreaChart</button>
        <button className={chartKind === 3 ? styles.active : undefined} onClick={() => setChartKind(3)}>BarChart</button>
        <button className={chartKind === 4 ? styles.active : undefined} onClick={() => setChartKind(4)}>PieChart</button>
        <button className={chartKind === 5 ? styles.active : undefined} onClick={() => setChartKind(5)}>RadialBarChart</button>
        {isConnected && (
          <button onClick={() => disconnect()}>disconnect</button>
        )}
        {!isConnected && <button onClick={() => connect()}>connect</button>}
      </header>
      <br />
      <main className={styles.main}>
        {!isConnected && "No connection"}
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </main>
    </>
  );
}
