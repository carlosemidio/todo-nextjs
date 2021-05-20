import { VercelRequest, VercelResponse } from "@vercel/node";
import connectToDatabase from "../../../utils/DatabaseConnection";

export default async (req: VercelRequest, res: VercelResponse) => {
  const db = await connectToDatabase(process.env.MONGODB_URI);
  const todos = await db.collection("todo").find().toArray();

  res.status(200).json({ todos: todos });
};
