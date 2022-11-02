import { pocketClient, NextAuthStore } from "../../lib/pocketbase";

export default async function handler(req, res) {
  try {
    pocketClient.authStore = new NextAuthStore(req, res);
    await pocketClient.authStore.clear();
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(error.data.code).json(error.data);
  }
}
