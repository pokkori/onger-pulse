import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const SCREEN_CENTER_X = width / 2;
export const SCREEN_CENTER_Y = height / 2;

/** HUD area height */
export const HUD_HEIGHT = 60;

/** Pulse ring radius */
export const PULSE_RING_RADIUS = 60;

/** Spawn margin beyond screen edge */
export const SPAWN_MARGIN = 50;
