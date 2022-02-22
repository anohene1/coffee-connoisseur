import { table, getMinifiedRecords } from "../../lib/airtable";

export default async function createCoffeeStore(req, res) {
  if (req.method === "POST") {
    const { fsq_id, name, formatted_address, neighborhood, imgUrl, voting } =
      req.body;

    try {
      if (fsq_id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `fsq_id="${fsq_id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords);
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  fsq_id,
                  name,
                  formatted_address,
                  neighborhood,
                  imgUrl,
                  voting,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "name is missing" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "id is missing" });
      }
    } catch (error) {
      console.log("Error creating or finding store", error);
      res.status(500);
      res.json({ message: "Error creating or finding store", error });
    }
  }
}
