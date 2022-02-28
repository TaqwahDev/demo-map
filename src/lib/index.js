import * as Location from "expo-location";
import { GeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";
import React from "react";
import { Keyboard } from "react-native";
import env from "../../env";
import locationContext from "../context/location-context";

export default function useLocation() {
    const locationCtx = React.useContext(locationContext);
    const LOCATION_TRACKING = "LOCATION_TRACKING";
    const WATCH_WAYPOINTS = "WATCH_WAYPOINTS";

    const askPerMission = async () => {
        const permissionForg =
            await Location.requestForegroundPermissionsAsync();
        const permissionBag =
            await Location.requestBackgroundPermissionsAsync();
        return (
            permissionForg.status === "granted" &&
            permissionBag.status === "granted"
        );
    };

    const getUserLocation = async () => {
        locationCtx.setIsLoading(true);
        try {
            const location = await Location.getCurrentPositionAsync({});
            const locationCurr = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            locationCtx.setCurrentLocation(locationCurr);
            locationCtx.setOrigin(locationCurr);
            locationCtx.setIsLoading(false);
        } catch (error) {
            console.log("error", error);
            locationCtx.setIsLoading(false);
            locationCtx.setErrorMsg("eror1", error.message);
        }
    };

    const startLocationTracking = async () => {
        locationCtx.setIsLoading(true);
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 2000,
            distanceInterval: 0,
        });
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TRACKING
        );
        console.log("tracking started?", hasStarted);

        if (hasStarted) {
            locationCtx.setIsLoading(false);
        }
    };

    const getWaypoints = async () => {
        const origin = locationCtx.origin;
        const destination = locationCtx.destination;
        if (!origin || !destination) {
            locationCtx.setWaypoints(null);
            locationCtx.setSteps(null);
            return;
        }
        try {
            const resopnse = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${env.GOOGLE_API_KEY}`
            );
            const data = await resopnse.json();
            const steps = data.routes[0].legs[0].steps;
            const waypoints = steps.map((step) => {
                const { start_location } = step;
                return {
                    latitude: start_location.lat,
                    longitude: start_location.lng,
                    radius: 50,
                };
            });
            locationCtx.setWaypoints(waypoints);
            locationCtx.setSteps(steps);
        } catch (error) {
            locationCtx.setErrorMsg("Error 2", error.message);
        }
    };

    const watchPosition = async () => {
        // console.log(locationCtx.waypoints)
        try {
            await Location.startGeofencingAsync(
                WATCH_WAYPOINTS,
                locationCtx.waypoints
            );
        } catch (error) {
            console.log("error", error);
            locationCtx.setErrorMsg(error.message);
        }
    };

    const handleSearchSelector = (data, details = null) => {
        const { lat, lng } = details.geometry.location;
        locationCtx.setDestination({
            latitude: lat,
            longitude: lng,
            description: data.description,
        });
        Keyboard.dismiss();
    };

    const config = async () => {
        let res = await askPerMission();
        if (!res) {
            console.log("Permission to access location was denied");
        } else {
            await Location.setGoogleApiKey(env.GOOGLE_API_KEY);
            console.log("Permission to access location granted");
        }
    };

    const stopLocationTracking = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TRACKING
        );

        if (hasStarted) {
            Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
            console.log("tracking stopped");
        }
    };

    const stopGeoFencing = async () => {
        const hasStarted =
            await Location.hasStartedLocationUpdatesAsync(WATCH_WAYPOINTS);
        if (hasStarted) {
            Location.stopGeofencingAsync(WATCH_WAYPOINTS);
            console.log("watchPosition stopped");
        }
    };

    TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
        if (error) {
            console.log("LOCATION_TRACKING task ERROR:", error);
            return;
        }
        if (data) {
            const { locations } = data;
            let lat = locations[0].coords.latitude;
            let long = locations[0].coords.longitude;
            const locationCurr = {
                latitude: lat,
                longitude: long,
            };
            locationCtx.setCurrentLocation(locationCurr);
            console.log(
                `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
            );
        }
    });

    TaskManager.defineTask(
        WATCH_WAYPOINTS,
        ({ data: { eventType, region }, error }) => {
            if (error) {
                // check `error.message` for more details.
                return;
            }
            if (eventType === GeofencingEventType.Enter) {
                try {
                    locationCtx.setCurrentWayPoints(region);
                } catch (ee) {
                    console.log("error", ee);
                }
            } else if (eventType === GeofencingEventType.Exit) {
                locationCtx.setCurrentWayPoints(null);
                // console.log("You've left region:", region);
            }
        }
    );

    return [
        getUserLocation,
        getWaypoints,
        watchPosition,
        handleSearchSelector,
        config,
        startLocationTracking,
        stopLocationTracking,
        stopGeoFencing,
    ];
}
