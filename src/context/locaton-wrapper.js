import React from "react";
import LocationContext from "./location-context";

const defaultState = {
    origin: null,
    destination: null,
    currentLocation: null,
    isLoading: false,
    errorMsg: null,
    travelMode: null,
    waypoints: [],
    steps: [],
};

const locationReducer = (state, action) => {
    if (action.type === "ADD_ORIGIN") {
        return {
            ...state,
            origin: action.payload,
        };
    }
    if (action.type === "ADD_DESTINATION") {
        return {
            ...state,
            destination: action.payload,
        };
    }
    if (action.type === "ADD_CURRLOCATION") {
        return {
            ...state,
            currentLocation: action.payload,
        };
    }
    if (action.type === "CLEAR_STATE") {
        return {
            ...state,
            origin: null,
            destination: null,
            currentLocation: null,
            isLoading: false,
            errorMsg: null,
            travelMode: null,
            waypoints: null,
            steps: null,
        };
    }
    if (action.type === "SET_LOADING") {
        return {
            ...state,
            isLoading: action.payload,
        };
    }
    if (action.type === "SET_ERROR") {
        return {
            ...state,
            errorMsg: action.payload,
        };
    }
    if (action.type === "SET_MODE") {
        return {
            ...state,
            travelMode: action.payload,
        };
    }
    if (action.type === "SET_WAYPOINTS") {
        return {
            ...state,
            waypoints: action.payload,
        };
    }

    if (action.type === "SET_STEPS") {
        return {
            ...state,
            steps: action.payload,
        };
    }

    return state;
};

export default function LocationWrapper({ children }) {
    const [locationState, locationDispatch] = React.useReducer(
        locationReducer,
        defaultState
    );

    const addOrigin = (origin) => {
        locationDispatch({ type: "ADD_ORIGIN", payload: origin });
    };

    const addDestination = (destination) => {
        locationDispatch({ type: "ADD_DESTINATION", payload: destination });
    };
    const addCurrentLocation = (currentLocation) => {
        locationDispatch({
            type: "ADD_CURRLOCATION",
            payload: currentLocation,
        });
    };

    const state = {
        origin: locationState.origin,
        destination: locationState.destination,
        currentLocation: locationState.currentLocation,
        setOrigin: addOrigin,
        setDestination: addDestination,
        setCurrentLocation: addCurrentLocation,
        clearState: () => {
            locationDispatch({ type: "CLEAR_STATE" });
        },
        isLoading: locationState.isLoading,
        errorMsg: locationState.errorMsg,
        setIsLoading: () => {
            locationDispatch({ type: "SET_LOADING" });
        },
        setErrorMsg: (message) => {
            locationDispatch({ type: "SET_ERROR", payload: message });
        },
        travelMode: locationState.travelMode,
        setTravelMode: (travelMode) => {
            locationDispatch({ type: "SET_MODE", payload: travelMode });
        },
        waypoints: locationState.waypoints,
        setWaypoints: (waypoints) => {
            locationDispatch({ type: "SET_WAYPOINTS", payload: waypoints });
        },
        steps: locationState.steps,
        setSteps: (steps) => {
            locationDispatch({ type: "SET_STEPS", payload: steps });
        },
    };

    return (
        <LocationContext.Provider value={state}>
            {children}
        </LocationContext.Provider>
    );
}
