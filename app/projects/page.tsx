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

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    fetchProjects();
  }, []);

  async function fetchProjects() {
    const q = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Project, "id">),
    }));

    setProjects(data);
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description);
  }

  async function saveEdit(id: string) {
    await updateDoc(doc(db, "projects", id), {
      title: editTitle,
      description: editDescription,
    });

    setEditingId(null);
    fetchProjects();
  }

  return (
    <div>
      <h1>Portfolio</h1>

      {projects.map((project) => (
        <div className="glass" key={project.id}>
          {editingId === project.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <button onClick={() => saveEdit(project.id)}>
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
              <h2>{project.title}</h2>

              <div
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.5,
                  fontFamily: "monospace",
                  marginTop: "6px",
                }}
              >
                {project.createdAt
                  ?.toDate()
                  .toISOString()
                  .slice(0, 10)}
              </div>

              <p style={{ marginTop: "18px" }}>
                {project.description}
              </p>

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
                    onClick={() => startEdit(project)}
                  >
                    EDIT
                  </span>

                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(project.id)}
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
