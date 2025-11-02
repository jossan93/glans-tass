const apiUrl =
    import.meta.env.MODE === "production"
        ? "https://glans-and-tass.onrender.com/api"
        : "http://localhost:3000/api"

export default apiUrl; 