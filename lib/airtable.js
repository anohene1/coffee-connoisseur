const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

function getMinifiedRecords(records) {
  return records.map((record) => ({
    ...record.fields,
    recordID: record.id,
  }));
}

async function findRecordByFilter(fsq_id) {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `fsq_id="${fsq_id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
}

export { table, getMinifiedRecords, findRecordByFilter };
