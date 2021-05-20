import { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "bson";
import connectToDatabase from "../../../../utils/DatabaseConnection";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { _id } = req.query;

  const db = await connectToDatabase(process.env.MONGODB_URI);
  const todo = await db.collection("todo").deleteOne({ _id: ObjectId(_id) });

  res.status(200).json({ todo: todo.deletedCount });
};
