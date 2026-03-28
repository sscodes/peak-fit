export const ENV = import.meta.env.MODE;

export const isProduction = ENV === "production";
export const isDevelopment = ENV === "development";
export const isStaging = ENV === "staging";
