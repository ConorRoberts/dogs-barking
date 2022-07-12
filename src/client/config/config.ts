export const live = process.env.NODE_ENV === "production";
const mode = live ? "production" : "development";

export const APP_NAME = "Dogs Barking";
export const API_URL = `https://api.dogs-barking.ca/${mode}`;

export const GOOGLE_MAPS_API_KEY = "AIzaSyBFOXAHpJwLKqnfW8jMjSXWdHXfMkMsvYc";

export const CATALOG_FILTER_OPTIONS = ["code", "number", "name", "description"];
export const CATALOG_SELECTION_OPTIONS = ["course", "program", "school"];

export const WEBSITE_URL = live ? "https://dogs-barking.ca" : "http://localhost:3000";
