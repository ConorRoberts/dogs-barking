export const live = process.env.NODE_ENV === "production";

export const APP_NAME = "Dogs Barking";
export const API_URL = "https://api.dogs-barking.ca";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBFOXAHpJwLKqnfW8jMjSXWdHXfMkMsvYc";

export const CATALOG_FILTER_OPTIONS = ["code", "number", "name", "description"];

// const apiStage = live ? "prod" : "dev";

export const WEBSITE_URL = live ? "https://dogs-barking.ca" : "http://localhost:3000";

