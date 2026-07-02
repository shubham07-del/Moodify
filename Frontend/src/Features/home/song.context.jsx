import { useState } from "react";
import { createContext } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({children})=>{

    const [song, setSong] = useState({})
    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{song, setSong,  loading, setLoading}}>
            {children}
        </SongContext.Provider>
    )
}
