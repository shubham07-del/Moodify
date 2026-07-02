const id3 = require("node-id3")
const storageService = require("../services/storage.service")
const songModel = require("../models/song.model")


async function uploadSongController(req,res){

    const songBuffer = req.file.buffer
    const tags = id3.read(songBuffer)
    const {mood} = req.body 

    const [songFile, posterFile] = await Promise.all([
        storageService.uploadFile({
            buffer:songBuffer,
            filename:tags.title + ".mp3",
            folder:"/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer:tags.image.imageBuffer,
            filename:tags.title + ".jpeg" ,
            folder:"/cohort-2/moodify/posters"
        })
    ])
    
    const song = await songModel.create({
        title:tags.title,
        url:songFile.url,
        posterUrl:posterFile.url,
        mood
    })

    res.status(201).json({
        message:"Song uploaded successfully.",
        song
    })
}

async function getSong(req,res){
    const {mood} = req.query

    const songs = await songModel.aggregate([
        { $match: { mood } },
        { $sample: { size: 1 } }
    ]);
    
    const song = songs.length > 0 ? songs[0] : null;
    res.status(200).json({
        message:"song fetched succesfully.",
        song
    })
}

module.exports = {uploadSongController, getSong}