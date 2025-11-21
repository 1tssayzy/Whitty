export async function getCurrentUser() {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}
