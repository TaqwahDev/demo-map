import { useNavigation } from "@react-navigation/native";
import * as TaskManager from "expo-task-manager";
import {
    Button,
    KeyboardAvoidingView,
    Pressable,
    Text,
    VStack
} from "native-base";
import React from "react";
import { ActivityIndicator, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import env from "../../../env";
import locationContext from "../../context/location-context";
import useLocation from "../../lib";


export default function SelectArea() {
    let clear = true;
    const navigation = useNavigation();
    const locationCtx = React.useContext(locationContext);
    const [
        getUserLocation,
        getWaypoints,
        startGeofencing,
        handleSearchSelector,
        config,
        startLocationTracking,
        stopLocationTracking,
        stopGeoFencing,
    ] = useLocation();

    const handleNavigation = () => {
        if (!locationCtx.destination) {
            alert("Please select origin");
            return;
        }
        navigation.navigate("Map");
    };

    React.useEffect(() => {
        config();
        startLocationTracking();
        getUserLocation();

        return () => {
            stopLocationTracking();
            stopGeoFencing();
            TaskManager.unregisterAllTasksAsync();
        };
    }, []);

    React.useEffect(() => {
        if (locationCtx.errorMsg) {
            alert(locationCtx.errorMsg);
            console.log("error", locationCtx.errorMsg);
        }
        if (clear) {
            return () => (clear = false);
        }
    }, [locationCtx.errorMsg]);

    React.useEffect(() => {
        try {
            getWaypoints();
        } catch (error) {
            console.log("error", error);
        }
        // console.log("currentWayPoints", locationCtx.currentWayPoints);
        if (clear) {
            return () => (clear = false);
        }
    }, [locationCtx.origin, locationCtx.destination]);

    React.useEffect(() => {
        if (
            locationCtx.destination &&
            locationCtx.waypoints &&
            locationCtx.waypoints.length > 0
        ) {
            startGeofencing();
        } else {
            stopGeoFencing();
        }
        if (clear) {
            return () => (clear = false);
        }
    }, [locationCtx.waypoints, locationCtx.destination]);

    if (locationCtx.isLoading) {
        return (
            <VStack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator size="large" color="#9150F8" />
            </VStack>
        );
    }
 

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
