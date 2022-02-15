function getUrlForCoffeeStores(latLong, query, limit) {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
}

export async function fetchCoffeeStores() {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_AUTHORIZATION,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores("43.652,-79.395", "coffee", "7"),
    options
  );
  const data = await response.json();
  return data.results;
}
