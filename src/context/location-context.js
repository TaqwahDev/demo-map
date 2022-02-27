import React from 'react';

const locationContext = React.createContext({
    origin:null,
    destination:null,
    currentLocation:null,
    setOrigin:()=>{},
    setDestination:()=>{},
    setCurrentLocation:()=>{},
    clearState:()=>{},
    isLoading:false,
    errorMsg:null,
    setIsLoading:()=>{},
    setErrorMsg:()=>{},
    travelMode:null,
    setTravelMode:()=>{},
    waypoints:[],
    setWaypoints:()=>{},
    steps:[],
    setSteps:()=>{},
    

});

export default locationContext;