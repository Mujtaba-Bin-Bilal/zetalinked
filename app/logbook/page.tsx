"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface Log {
  id: string;
  action: string;
  content?: string;
  image?: string;
  type?: "system" | "entry";
  timestamp: Timestamp;
}

export default function Record() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAction, setEditAction] = useState("");
  const [editContent, setEditContent] = useState("");

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    fetchLogs();
  }, []);

  async function fetchLogs() {
    const q = query(
      collection(db, "logs"),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Log, "id">),
    }));

    setLogs(data);
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "logs", id));
    fetchLogs();
  }

  function startEdit(log: Log) {
    setEditingId(log.id);
    setEditAction(log.action);
    setEditContent(log.content || "");
  }

  async function saveEdit(id: string) {
    await updateDoc(doc(db, "logs", id), {
      action: editAction,
      content: editContent,
    });

    setEditingId(null);
    fetchLogs();
  }

  return (
    <div>
      <h1>Record</h1>

      {logs.map((log) => (
        <div className="glass" key={log.id}>
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

          {editingId === log.id ? (
            <>
              <input
                value={editAction}
                onChange={(e) => setEditAction(e.target.value)}
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <button onClick={() => saveEdit(log.id)}>
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{log.action}</h3>

              {log.content && (
                <p style={{ marginTop: "12px" }}>
                  {log.content}
                </p>
              )}

              {log.image && (
                <img
                  src={log.image}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "15px",
                  }}
                />
              )}

              {user && (
                <div
                  style={{
                    marginTop: "15px",
                    fontSize: "0.75rem",
                    opacity: 0.6,
                  }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                    }}
                    onClick={() => startEdit(log)}
                  >
                    EDIT
                  </span>

                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(log.id)}
                  >
                    DELETE
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
