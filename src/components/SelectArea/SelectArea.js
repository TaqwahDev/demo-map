import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { GeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
    Button,
    KeyboardAvoidingView,
    Pressable,
    Text,
    VStack,
} from "native-base";
import React from "react";
import { ActivityIndicator, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import env from "../../../env";
import locationContext from "../../context/location-context";

export default function SelectArea() {
    let clear = true;
    const navigation = useNavigation();
    const locationCtx = React.useContext(locationContext);

    const [currentWayPoints, setCurrentWayPoints] = React.useState(null);

    const isLocationPermitted = async () => {
        const permissionForg =
            await Location.requestForegroundPermissionsAsync();
        const permissionBag =
            await Location.requestBackgroundPermissionsAsync();
        return (
            permissionForg.status === "granted" &&
            permissionBag.status === "granted"
        );
    };

    const handleSearchSelector = (data, details = null) => {
        const { lat, lng } = details.geometry.location;
        // console.log(data.description);
        locationCtx.setDestination({
            latitude: lat,
            longitude: lng,
            description: data.description,
        });
        Keyboard.dismiss();
    };

    const handleNavigation = () => {
        if (!locationCtx.destination) {
            alert("Please select origin");
            return;
        }
        navigation.navigate("Map");
    };

    TaskManager.defineTask(
        "UPDATE_LOCATION",
        ({ data: { locations }, error }) => {
            if (error) {
                console.log("Error: ", error);
                return;
            }
            const coordinate = locations[0].coords;
            const locationCurr = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            };
            locationCtx.setCurrentLocation(locationCurr);
        }
    );

    console.log(currentWayPoints);

    TaskManager.defineTask(
        "WATCH_POSITION",
        ({ data: { eventType, region }, error }) => {
            if (error) {
                // check `error.message` for more details.
                return;
            }
            if (eventType === GeofencingEventType.Enter) {
                //   console.log("You've entered region:", region);
                try {
                    setCurrentWayPoints(region);
                } catch (ee) {
                    console.log("error", ee);
                }
            } else if (eventType === GeofencingEventType.Exit) {
                setCurrentWayPoints(null);
                // console.log("You've left region:", region);
            }
        }
    );

    const startLocationUpdates = async () => {
        const permission = await isLocationPermitted();

        if (!permission) {
            return;
        }

        locationCtx.setIsLoading(true);
        try {
            await Location.startLocationUpdatesAsync("UPDATE_LOCATION", {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 2000,
                distanceInterval: 5,
            });
            locationCtx.setIsLoading(false);
        } catch (err) {
            console.log("error", err);
            locationCtx.setIsLoading(false);
            locationCtx.setErrorMsg(err.message);
        }
    };

    const stopLocationUpdates = async () => {
        locationCtx.setIsLoading(true);
        try {
            Location.stopLocationUpdatesAsync("UPDATE_LOCATION");
            if (locationCtx.waypoints.length > 0) {
                Location.stopGeofencingAsync("WATCH_POSITION");
            }
            Location.setGoogleApiKey(null);
            locationCtx.setIsLoading(false);
        } catch (err) {
            console.log("error", err);
            locationCtx.setIsLoading(false);
            locationCtx.setErrorMsg(err.message);
        }
    };

    const getLocation = async () => {
        locationCtx.setIsLoading(true);
        try {
            const permission = await isLocationPermitted();
            if (!permission) {
                alert("Please enable location permission");
                return;
            }
            await Location.setGoogleApiKey(env.GOOGLE_API_KEY);
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
            locationCtx.setErrorMsg(error.message);
        }
    };

    React.useEffect(() => {
        startLocationUpdates();
        getLocation();
        return () => {
            stopLocationUpdates();
            locationCtx.clearState();
        };
    }, []);

    React.useEffect(() => {
        if (locationCtx.errorMsg) {
            alert(locationCtx.errorMsg);
            console.log("error", locationCtx.errorMsg);
        }
    }, [locationCtx.errorMsg]);

    React.useEffect(() => {
        const getWaypoints = async () => {
            const origin = locationCtx.origin;
            const destination = locationCtx.destination;
            if (!origin || !destination) {
                return;
            }
            try {
                const resopnse = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${env.GOOGLE_API_KEY}`
                );
                const data = await resopnse.json();
                const steps = data.routes[0].legs[0].steps;
                // console.log("steps", steps);
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
                // console.log("data", steps);
            } catch (error) {
                locationCtx.setErrorMsg(error.message);
            }
        };
        getWaypoints();
    }, [locationCtx.origin, locationCtx.destination]);

    if (locationCtx.isLoading) {
        return (
            <VStack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator size="large" color="#9150F8" />
            </VStack>
        );
    }

    React.useEffect(() => {
        const watchPosition = async () => {
            // console.log(locationCtx.waypoints)
            try {
                await Location.startGeofencingAsync(
                    "WATCH_POSITION",
                    locationCtx.waypoints
                );
            } catch (error) {
                console.log("error", error);
                locationCtx.setErrorMsg(error.message);
            }
        };

        if (
            locationCtx.destination &&
            locationCtx.waypoints &&
            locationCtx.waypoints.length > 0
        ) {
            watchPosition();
        }
    }, [locationCtx.waypoints, locationCtx.destination]);

    React.useEffect(() => {
        if (currentWayPoints) {
            // console.log("currentWayPoints", currentWayPoints);
        }
    }, [currentWayPoints]);

    return (
        <KeyboardAvoidingView flex="1">
            <Pressable
                onPress={() => Keyboard.dismiss()}
                bg="dark.100"
                flex="1"
                p="4"
            >
                <Text fontSize={18} py={2}>
                    Select Destination
                </Text>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={handleSearchSelector}
                    query={{
                        key: env.GOOGLE_API_KEY,
                        language: "en",
                    }}
                    styles={{
                        textInputContainer: {
                            marginVertical: 10,
                        },
                        textInput: {
                            height: 50,
                            color: "#5d5d5d",
                            fontSize: 16,
                            paddingHorizontal: 15,
                        },
                        predefinedPlacesDescription: {
                            color: "#1faadb",
                        },
                    }}
                />
                <Button onPress={handleNavigation} mt={4}>
                    Go
                </Button>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
