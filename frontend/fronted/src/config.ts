const apiUrl =
    import.meta.env.MODE === "production"
        ? "https://glans-and-tass.onrender.com/api"
        : "http://localhost:3000/api"
/*
const apiUrl =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "https://glans-and-tass.onrender.com/api" */

// const apiUrl = "https://glans-and-tass.onrender.com/api";
export default apiUrl; 