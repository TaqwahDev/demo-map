import ThemeConfig from "../theme-config";
import SelectArea from "./components/SelectArea/SelectArea";
import LocationWrapper from "./context/locaton-wrapper";
import React from 'react';
import Main from "./Main";


export default function index() {
    return (
        <ThemeConfig>
            <LocationWrapper>
               <Main />
            </LocationWrapper>
            {/* <Home /> */}
        </ThemeConfig>
    );
}
