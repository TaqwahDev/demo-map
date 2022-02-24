import * as Location from "expo-location";
import { useState } from "react";
import * as TaskManager from "expo-task-manager";

export default function useLocation() {
    const [errorMsg, setErrorMsg] = useState(null);

    TaskManager.defineTask("YOUR_TASK_NAME", ({ data: { locations }, error }) => {
        if (error) {
            // check `error.message` for more details.
            return;
        }
        console.log("Received new locations", locations);
    });

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }
        let loc = await Location.getCurrentPositionAsync({});
       
        // await Location.startLocationUpdatesAsync("YOUR_TASK_NAME", {
        //     accuracy: Location.Accuracy.Balanced,
        // });
        return loc.coords;
    };

    return [getLocation, errorMsg];
}
