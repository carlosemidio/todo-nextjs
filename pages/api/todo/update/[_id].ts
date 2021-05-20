import { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "bson";
import connectToDatabase from "../../../../utils/DatabaseConnection";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { _id } = req.query;
  const { title, description, finalized } = req.body;

  const db = await connectToDatabase(process.env.MONGODB_URI);
  const collection = db.collection("todo");

  const todo = await collection.findOneAndUpdate(
    { _id: ObjectId(_id) },
    {
      $set: {
        title,
        description,
        finalized,
      },
    },
    { upsert: true, returnOriginal: false }
  );

  res.status(200).json({ todo: todo.value });
};
