import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addLog(
  action: string,
  content: string = "",
  image: string = "",
  type: "system" | "entry" = "system"
) {
  await addDoc(collection(db, "logs"), {
    action,
    content,
    image,
    type,
    timestamp: serverTimestamp(),
  });
}
