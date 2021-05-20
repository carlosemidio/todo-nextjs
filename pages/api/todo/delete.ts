import { VercelRequest, VercelResponse } from "@vercel/node";
import connectToDatabase from "../../../utils/DatabaseConnection";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { title } = req.query;

  const db = await connectToDatabase(process.env.MONGODB_URI);
  const todo = await db.collection("todo").deleteOne({ title: title });

  res.status(200).json({ todo: todo.deletedCount });
};
