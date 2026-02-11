"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { addLog } from "../../lib/firestore";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [intro, setIntro] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const [message, setMessage] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");


  // Detect authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Logged in successfully.");
    } catch (error) {
      setMessage("Login failed.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setMessage("Logged out.");
  }

  async function updateIntro() {
    if (!user) return;

    await setDoc(doc(db, "content", "intro"), {
      text: intro,
    });

    await addLog("Updated intro section", intro);

    setMessage("Intro updated and logged.");
  }

  async function createLog() {
    if (!user) return;

    await addLog(title, content, image,"entry");

    setTitle("");
    setContent("");
    setImage("");

    setMessage("Log entry added.");
  }
  async function createProject() {
  if (!user) return;

  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  await addDoc(collection(db, "projects"), {
    title: projectTitle,
    description: projectDescription,
    createdAt: serverTimestamp(),
  });

  await addLog(`Created project: ${projectTitle}`);

  setProjectTitle("");
  setProjectDescription("");
  setMessage("Project created.");
}


  // If not logged in → show login form
  if (!user) {
    return (
      <div className="glass">
        <h1>Admin Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>{message}</p>
      </div>
    );
  }

  // If logged in → show admin panel
  return (
    <div className="glass">
      <h1>Admin Panel</h1>

      {/* Intro Editor */}
      <h2 style={{ marginTop: "20px" }}>Edit Intro</h2>

      <textarea
        placeholder="Update your intro..."
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
      />

      <button onClick={updateIntro}>Save Intro</button>

      {/* Manual Log Entry */}
      <h2 style={{ marginTop: "40px" }}>Add Log Entry</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="What did you work on?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        placeholder="Image path (optional) e.g. /uploads/workout.jpg"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button onClick={createLog}>Add Log</button>
      {/* Add Project Section */}
<h2 style={{ marginTop: "40px" }}>Add Project</h2>

<input
  placeholder="Project Title"
  value={projectTitle}
  onChange={(e) => setProjectTitle(e.target.value)}
/>

<textarea
  placeholder="Project Description"
  value={projectDescription}
  onChange={(e) => setProjectDescription(e.target.value)}
/>

<button onClick={createProject}>Create Project</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p style={{ marginTop: "15px" }}>{message}</p>
    </div>
  );
}
