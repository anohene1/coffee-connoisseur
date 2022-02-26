import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

export default async function getCoffeeStoreById(req, res) {
  const { fsq_id } = req.query;

  try {
    if (fsq_id) {
      const records = await findRecordByFilter(fsq_id);
      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `ID could not be found ` });
      }
    } else {
      res.status(400);
      res.json({ message: "ID is missing" });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
}
