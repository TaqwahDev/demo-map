import React from 'react';

const locationContext = React.createContext({
    origin:null,
    destination:null,
    currentLocation:null,
    setOrigin:()=>{},
    setDestination:()=>{},
    setCurrentLocation:()=>{},
    clearState:()=>{}
});

export default locationContext;