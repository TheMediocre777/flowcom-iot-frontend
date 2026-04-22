import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import ChartPanel from "./components/ChartPanel";
import DataTable from "./components/DataTable";
import { generateMockHistory, generateNewDataPoint } from "./utils/mockData";
import { getLatestValues } from "./utils/helpers";
import "./index.css";

const METRICS = ["flowrate", "pressure", "temperature", "totalizer"];

export default function App() {
  const [history, setHistory] = useState(() => generateMockHistory(20));
  const [selectedMetric, setSelectedMetric] = useState("flowrate");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isConnected] = useState(true);

  const updateTime = () => {
    setLastUpdated(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB"
    );
  };

  const fetchData = useCallback(() => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      return [...prev.slice(-29), generateNewDataPoint(last)];
    });
    updateTime();
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const latest = getLatestValues(history);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #080e1a 0%, #0a1628 50%, #080e1a 100%)",
      fontFamily: "'Syne', sans-serif",
      padding: "32px 24px",
      animation: "fadeUp 0.5s ease both",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 10% 10%, rgba(0,212,255,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 90% 80%, rgba(167,139,250,0.05) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>
        <Header
          lastUpdated={lastUpdated}
          isConnected={isConnected}
          onRefresh={fetchData}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}>
          {METRICS.map((key, i) => (
            <div key={key} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
              <MetricCard
                metricKey={key}
                value={latest[key] ?? 0}
                isSelected={selectedMetric === key}
                onClick={() => setSelectedMetric(key)}
              />
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          animation: "fadeUp 0.5s ease 0.3s both",
        }}>
          <ChartPanel metricKey={selectedMetric} history={history} />
          <DataTable history={history} />
        </div>

        <div style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 10,
          color: "rgba(255,255,255,0.15)",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: 2,
        }}>
          FLOWSENSE IOT · POC v0.1 · DATA REFRESHED EVERY 3s
        </div>
      </div>
    </div>
  );
}