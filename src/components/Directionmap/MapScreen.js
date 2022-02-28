import { Image, Text, VStack } from "native-base";
import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import env from "../../../env";
import locationContext from "../../context/location-context";
const destImage = require("../../../assets/maoicons/home.png");
const originImage = require("../../../assets/maoicons/track.png");

export default function MapScreen() {
    const locationCtx = React.useContext(locationContext);
    const { width, height } = Dimensions.get("window");

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const destinationLocation = locationCtx.destination || null;
    const currentLocation = locationCtx.currentLocation || null;

    const mapRef = React.useRef(null);

    if (locationCtx.isLoading || !currentLocation) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#9150F8" />
            </View>
        );
    }

    const [position, setPosition] = React.useState({
        distance: 0,
        duration: 0,
    });



    return (
        <VStack
            position={"relative"}
            flex="1"
            justifyContent={"center"}
            alignItems="center"
        >
            <VStack
                p="4"
                borderRadius={10}
                top="4"
                zIndex={100}
                position={"absolute"}
                w="90%"
                minH="120"
                bg="#fff"
            >
                <Text
                    color={"#000"}
                    fontSize={16}
                    fonrWeight="700"
                    fontFamaily="body"
                    textAlign="center"
                >
                    Destination: {locationCtx.destination.description}
                </Text>
                <Text
                    color={"#000"}
                    fontSize={16}
                    fonrWeight="700"
                    fontFamaily="body"
                    textAlign="center"
                >
                    Distance: {position.distance} km
                </Text>
                <Text
                    color={"#000"}
                    fontSize={16}
                    fonrWeight="700"
                    fontFamaily="body"
                    textAlign="center"
                >
                    Duration: {position.duration.toFixed(2)} min
                </Text>
            </VStack>

            <MapView
                ref={mapRef}
                style={styles.map}
                // onLayout={() => {
                //     mapRef.current.animateCamera({
                //         pitch: 90
                //     })
                // }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {currentLocation && (
                    <Marker
                        flat={true}
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
                        flat={true}
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
                            m="0"
                        />
                    </Marker>
                ) : null}
                {/* {locationCtx.waypoints.map((waypoint, index) => {
                    return (
                        <Marker
                            key={index.toString()}
                            coordinate={{
                                latitude: waypoint.latitude,
                                longitude: waypoint.longitude,
                            }}
                        />
                    );
                })} */}

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
                        mode="DRIVING"
                        region="bd"
                        onReady={(result) => {
                            const { distance, duration } = result;
                            console.log(result);
                            const res={distance,duration};
                            setPosition(res);

                            // console.log(`Distance: ${result.distance} km`);
                            // console.log(`Duration: ${result.duration} min.`);
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
        </VStack>
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
