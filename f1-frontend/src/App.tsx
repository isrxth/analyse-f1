import { useEffect, useState } from "react";
import type { DriverRaceMetrics } from "./types";

function App() {
  const [data, setData] = useState<DriverRaceMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
  fetch(`${API_BASE}/race/2023/metrics`) // backend URL
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((resData: DriverRaceMetrics[]) => {
      setData(resData);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>F1 Analytics v0.1 (TypeScript)</h1>
      <p>Race performance metrics (2023+)</p>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Driver Number</th>
              <th>Laps</th>
              <th>Best Lap</th>
              <th>Avg Lap</th>
              <th>Pit Out Laps</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.driver_number}>
                <td>{d.driver_number}</td>
                <td>{d.laps_completed}</td>
                <td>{d.best_lap.toFixed(3)}</td>
                <td>{d.avg_lap_time.toFixed(3)}</td>
                <td>{d.pit_out_laps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
