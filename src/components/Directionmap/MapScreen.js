import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Image } from "native-base";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import env from "../../../env";
import locationContext from "../../context/location-context";
import useLocation from "../../hooks/use-location";

const destImage = require("../../../assets/maoicons/home.png");
const originImage = require("../../../assets/maoicons/track.png");

export default function MapScreen() {
    const locationCtx = React.useContext(locationContext);
    console.log("destination", locationCtx.destination);

    const [getLocation, errorMsg] = useLocation();
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [heading, setHeading] = React.useState(null);
    const { width, height } = Dimensions.get("window");

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const destinationLocation = {
        latitude: locationCtx.destination.lat,
        longitude: locationCtx.destination.lng,
    };

    const mapRef = React.useRef(null);

    const locationHandler = async () => {
        const coords = await getLocation();
        const locationCurr = {
            latitude: coords.latitude,
            longitude: coords.longitude,
        };

        setCurrentLocation(locationCurr);
    };

    TaskManager.defineTask(
        "YOUR_TASK_NAME",
        ({ data: { locations }, error }) => {
            if (error) {
                // check `error.message` for more details.
                return;
            }
            const coordinate = locations[0].coords;
            const locationCurr = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            };
            setCurrentLocation(locationCurr);
            
        }
    );

    React.useEffect(() => {
        locationHandler();
        Location.startLocationUpdatesAsync("YOUR_TASK_NAME", {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 5,
        });

        return () => {
            setCurrentLocation(null);
            Location.stopLocationUpdatesAsync("YOUR_TASK_NAME");
        };
    }, []);

    React.useEffect(() => {
        if (
            currentLocation &&
            destinationLocation &&
            currentLocation.latitude === destinationLocation.latitude &&
            currentLocation.longitude === destinationLocation.longitude
        ) {
            alert("You have arrived at your destination");
            Location.stopLocationUpdatesAsync("YOUR_TASK_NAME");
        }
    }, [currentLocation, destinationLocation]);

    if (!currentLocation) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#9150F8" />
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {currentLocation && (
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        title="Current Location"
                        description="You are here"
                        identifier="origin"
                      
                    >
                        <Image w="35" h="60" alt="car" source={originImage} />
                    </Marker>
                )}
                {destinationLocation ? (
                    <Marker
                        coordinate={{
                            latitude: destinationLocation.latitude,
                            longitude: destinationLocation.longitude,
                        }}
                        title="Destination Location"
                        description="You going there"
                        identifier="destination"
                    >
                        <Image
                            style={{ width: 35, height: 60 }}
                            alt="car"
                            source={destImage}
                        />
                    </Marker>
                ) : null}

                {currentLocation && destinationLocation && (
                    <MapViewDirections
                        lineCap="square"
                        lineDashPattern={[1]}
                        strokeWidth={5}
                        origin={currentLocation}
                        destination={destinationLocation}
                        apikey={env.GOOGLE_API_KEY}
                        resetOnChange={false}
                        strokeColor="#3BAF92"
                        animate="jack-in"
                        onReady={(result) => {
                            mapRef.current.fitToCoordinates(
                                result.coordinates,
                                {
                                    edgePadding: {
                                        right: 200,
                                        bottom: 200,
                                        left: 200,
                                        top: 200,
                                    },
                                    animated: true,
                                }
                            );
                        }}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});
