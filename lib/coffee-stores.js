import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

function getUrlForCoffeeStores(latLong, query, limit) {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
}

async function getListOfCoffeeStorePhotos() {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shops",
    perPage: 20,
    orientation: "landscape",
  });

  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls.small);
}

export async function fetchCoffeeStores(latLong = "43.652,-79.395", limit = 6) {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_AUTHORIZATION,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee shops", limit),
    options
  );
  const data = await response.json();
  return data.results.map((venue, index) => ({
    ...venue,
    imgUrl: photos[index],
  }));
}
