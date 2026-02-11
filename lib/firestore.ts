export async function addLog(
  action: string,
  content: string = "",
  image: string = "",
  category: "system" | "thinking" | "execution" | "review" = "system"
) {
  await addDoc(collection(db, "logs"), {
    action,
    content,
    image,
    category,
    timestamp: serverTimestamp(),
  });
}
