import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export default function useTrackLocation() {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useContext(StoreContext);

  function success(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    // setLatLong(`${lat},${long}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: {
        latLong: `${lat},${long}`,
      },
    });
    setLocationErrorMsg("");
    setIsFindingLocation(false);
  }

  function error() {
    setIsFindingLocation(false);
    setLocationErrorMsg("Unable to retrieve your location.");
  }

  function handleTrackLocation() {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setIsFindingLocation(false);
      setLocationErrorMsg("Geolocation is not supported by your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return {
    locationErrorMsg,
    handleTrackLocation,
    isFindingLocation,
  };
}
