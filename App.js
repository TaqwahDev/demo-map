import React from "react";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import theme from "./theme-config/config";
import store from './store/'
import Index from "./src";

export default function App() {
    return (
        <Provider store={store}>
            <NativeBaseProvider theme={theme}>
                <Index />
            </NativeBaseProvider>
        </Provider>
    );
}
