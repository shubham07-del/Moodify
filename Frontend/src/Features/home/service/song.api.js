import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:3000/api",
    withCredentials:true
})

export async function getSong({mood}){
    const response = await api.get("/songs?mood="+mood)
    return response.data
}