import { BACKEND_URL } from "../config";

export async function getUserIdFromUsername(username: string): Promise<number> {
  const res = await fetch(`${BACKEND_URL}/api/v1/user/id/${username}`);
  if (!res.ok) throw new Error("User not found");
  const data = await res.json();
  if (typeof data.id !== "number") throw new Error("Invalid response");
  return data.id;
}