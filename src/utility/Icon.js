import { createIconSetFromIcoMoon } from "@expo/vector-icons";

const Icon = createIconSetFromIcoMoon(
    require("../../assets/icons/selection.json"),
    "CustomIcon",
    "icon.ttf"
);

export default Icon;

