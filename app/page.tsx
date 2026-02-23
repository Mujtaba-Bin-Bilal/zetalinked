"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

interface Log {
  timestamp: Timestamp;
}

export default function Home() {
  const [activity, setActivity] = useState<Record<string, number>>({});

  useEffect(() => {
  async function fetchActivity() {
    const dailyCounts: Record<string, number> = {};

    const [logsSnap, projectsSnap] = await Promise.all([
      getDocs(collection(db, "logs")),
      getDocs(collection(db, "projects")),
    ]);

    const process = (snapshot: any) => {
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (!data.timestamp) return;

        const date = data.timestamp.toDate();
        const key = date.toLocaleDateString("en-CA");

        dailyCounts[key] = (dailyCounts[key] || 0) + 1;
      });
    };

    process(logsSnap);
    process(projectsSnap);

    setActivity(dailyCounts);
  }

  fetchActivity();
}, []);

  function generateDays() {
    const days = [];
    const today = new Date();

    for (let i = 180; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const key = date.toISOString().split("T")[0];
      const count = activity[key] || 0;

      days.push({ key, count });
    }

    return days;
  }

  function getColor(count: number) {
    if (count === 0) return "rgba(255,255,255,0.04)";

    const max = Math.max(...Object.values(activity), 1);
    const intensity = count / max;

    const shade = Math.floor(120 + intensity * 80);
    return `rgb(${shade}, ${shade}, ${shade})`;
  }

  const days = generateDays();

  return (
    <div>
      {/* HERO */}
      <section style={{ marginBottom: "100px" }}>
        <h1>Mujtaba Bin Bilal</h1>
        <p>Systems win.</p>
      </section>

      {/* ACTIVITY GRID */}
      <section className="glass">
        <div className="heatmap-grid">
          {days.map((day) => (
            <div
              key={day.key}
              className="heatmap-cell"
              title={`${day.key} — ${day.count} entries`}
              style={{
                background: getColor(day.count),
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
