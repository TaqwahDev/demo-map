import { extendTheme } from "native-base";
import { fontConfig, fonts } from "./fontConfig";
import space from './space'
import colors from "./colors";
import typography from "./typography";


// Define the config
const config = {
    useSystemColorMode: false,
    initialColorMode: "dark",
};

// extend the theme
const theme = extendTheme({typography,space,colors,fontConfig,fonts,config });


export default theme;