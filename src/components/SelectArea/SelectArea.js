import {
    Button,
    Text,
    VStack,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
} from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import env from "../../../env";
import React from "react";
import { Keyboard } from "react-native";
import locationContext from "../../context/location-context";
import { useNavigation } from "@react-navigation/native";
import useLocation from "../../hooks/use-location";

export default function SelectArea() {
    const navigation = useNavigation();
    const locationCtx = React.useContext(locationContext);
    const [getLocation, errorMsg] = useLocation();

    
    const handleSearchSelector = (data, details = null) => {
        console.log(data.description, details.geometry.location);
        locationCtx.setDestination(details.geometry.location);
        Keyboard.dismiss();
    };

    const handleNavigation = () => {
        if (!locationCtx.destination) {
            alert("Please select origin");
            return;
        }
        navigation.navigate("Map");
    };



    return (
        <KeyboardAvoidingView flex="1">
            <Pressable
                onPress={() => Keyboard.dismiss()}
                bg="dark.100"
                flex="1"
                p="4"
            >
                <Text fontSize={18} py={2}>
                    Select Area
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
                <Button onPress={handleNavigation} mt={4}>Go</Button>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
