import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

export default async function favoriteCoffeeStoreById(req, res) {
  if (req.method === "PUT") {
    try {
      const { fsq_id } = req.body;

      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + 1;
          const updateRecord = await table.update([
            {
              id: record.recordID,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecord = getMinifiedRecords(updateRecord);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "Coffee store ID doesn't exist", fsq_id });
        }
      } else {
        res.status(400);
        res.json({ message: "ID is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
}
