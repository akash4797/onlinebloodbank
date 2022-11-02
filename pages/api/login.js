import { pocketClient, NextAuthStore } from "../../lib/pocketbase";

export default async function handler(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    pocketClient.authStore = new NextAuthStore(req, res);
    const authViaEmail = await pocketClient.users.authViaEmail(email, password);
    if (authViaEmail && !authViaEmail.user.profile?.admin) {
      res.status(200).json({ message: "Success" });
    } else {
      pocketClient.authStore.clear();
      throw new Error();
    }
  } catch (error) {
    if (error?.data?.code) {
      res.status(error.data.code).json(error.data);
    } else {
      res.status(401).json({ data: "not authorized" });
    }
  }
}
