import React from "react";
import LocationContext from "./location-context";

const defaultState = {
    origin: null,
    destination: null,
    currentLocation: null,
};

const locationReducer = (state, action) => {
    if(action.type==="ADD_ORIGIN"){
        return {
            ...state,
            origin:action.payload
        }
    }
    if(action.type==="ADD_DESTINATION"){
        return {
            ...state,
            destination:action.payload
        }
    }
    if(action.type==="ADD_CURRLOCATION"){
        return {
            ...state,
            currentLocation:action.payload
        }
    }
    if(action.type==="CLEAR_STATE"){
        return {
            ...state,
            origin:null,
            destination:null,
            currentLocation:null
        }
    }
    return state;
};

export default function LocationWrapper({ children }) {
    const [locationState, locationDispatch] = React.useReducer(
        locationReducer,
        defaultState
    );

    const addOrigin = (origin) => {
        locationDispatch({ type: "ADD_ORIGIN", payload:origin });
    };

    const addDestination = (destination) => {
        locationDispatch({ type: "ADD_DESTINATION", payload:destination });
    };
    const addCurrentLocation = (currentLocation) => {
        locationDispatch({ type: "ADD_CURRLOCATION", payload:currentLocation });
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
        }
    };

    return (
        <LocationContext.Provider value={state}>
            {children}
        </LocationContext.Provider>
    );
}
