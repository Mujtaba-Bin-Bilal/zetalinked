"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

interface Log {
  action: string;
  content?: string;
  image?: string;
  type?: "system" | "entry";
  timestamp: Timestamp;
}


export default function Record() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      const q = query(
        collection(db, "logs"),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data() as Log);
      setLogs(data);
    }

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Record</h1>

      {logs.map((log, index) => (
        <div className="glass" key={index}>
          <div
            style={{
              fontSize: "0.75rem",
              opacity: 0.5,
              fontFamily: "monospace",
              marginBottom: "8px",
            }}
          >
            {log.timestamp
              ?.toDate()
              .toISOString()
              .replace("T", " ")
              .slice(0, 16)}
          </div>

          <h3 style={{
  fontWeight: log.type === "entry" ? 600 : 400,
  letterSpacing: log.type === "entry" ? "0px" : "0.5px",
  textTransform: log.type === "system" ? "uppercase" : "none",
  opacity: log.type === "system" ? 0.6 : 1
}}>
  {log.action}
</h3>


          {log.content && (
            <p style={{ marginTop: "12px" }}>
              {log.content}
            </p>
          )}

          {log.image && (
            <img
              src={log.image}
              style={{
                marginTop: "15px",
                width: "100%",
                height: "auto"

              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
