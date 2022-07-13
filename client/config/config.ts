export const live = process.env.NODE_ENV === "production";
const mode = live ? "prod" : "dev";

export const APP_NAME = "Dogs Barking";
export const API_URL = `https://api.dogs-barking.ca/${mode}`;

export const GOOGLE_MAPS_API_KEY = "AIzaSyBFOXAHpJwLKqnfW8jMjSXWdHXfMkMsvYc";

export const CATALOG_FILTER_OPTIONS = ["code", "number", "name", "description"];
export const CATALOG_SELECTION_OPTIONS = ["course", "program", "school"];

export const CATALOG_COMPARATOR_OPTIONS = ["greater_than", "less_than", "equal_to", "greater_than_or_equal", "less_than_or_equal"];

export const CATALOG_DEFAULT_FILTERS = 
{
  "course":["code", "number", "name", "description", "level"],
  "program":["name", "degree", "code", "school"],
  "school":["country", "name", "code", "province", "city", "type", "description"],
};

export const WEBSITE_URL = live ? "https://dogs-barking.ca" : "http://localhost:3000";
