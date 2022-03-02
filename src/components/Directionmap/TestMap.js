import { Image, Text, VStack } from "native-base";
import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import env from "../../../env";
import locationContext from "../../context/location-context";
const destImage = require("../../../assets/maoicons/home.png");
const originImage = require("../../../assets/maoicons/track.png");

export default function TestMap() {
    const locationCtx = React.useContext(locationContext);
    const { width, height } = Dimensions.get("window");

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const destinationLocation = locationCtx.destination;
    const currentLocation = locationCtx.currentLocation;

    const mapRef = React.useRef(null);

    return (
        <VStack
            position={"relative"}
            flex="1"
            justifyContent={"center"}
            alignItems="center"
        >
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: locationCtx.origin.latitude,
                    longitude: locationCtx.origin.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
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


                {destinationLocation && (
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
