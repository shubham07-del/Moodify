import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSong } from "../service/song.api";

export const useSong = ()=>{
    const context = useContext(SongContext)

    const {loading, setLoading, song, setSong} = context

    const handleSong = async ({mood})=>{
        setLoading(true)
        const data = await getSong({mood})
        setSong(data.song)
        setLoading(false)
    }

    return ({handleSong, loading, song})
}