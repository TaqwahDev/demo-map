import { Text, VStack } from "native-base";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectArea from "./components/SelectArea/SelectArea";
import MapScreen from "./components/Directionmap/MapScreen";
import TestMap from "./components/Directionmap/TestMap";

const Stack = createNativeStackNavigator();

export default function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="SelectArea"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="SelectArea" component={SelectArea} />
                <Stack.Screen name="Map" component={TestMap} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
