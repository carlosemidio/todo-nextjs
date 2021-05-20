import { VercelRequest, VercelResponse } from "@vercel/node";
import connectToDatabase from "../../../utils/DatabaseConnection";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { title, description, finalized } = req.body;

  const db = await connectToDatabase(process.env.MONGODB_URI);
  const collection = await db.collection("todo");

  await collection.insertOne(
    {
      title,
      description,
      finalized,
      createdAt: new Date(),
    },
    function (err, docsInserted) {
      res.status(200).json({ todo: docsInserted.ops[0] });
    }
  );
};
