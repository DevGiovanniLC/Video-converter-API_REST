"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const videoConverter_1 = require("./videoConverter");
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
const upload = multer({ dest: __dirname + '/uploads/' });
app.use(cors());
app.use('./videos', express.static("dist/uploads/"));
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send(' No file was uploaded');
    }
    const videoPath = req.file.path;
    const convertedTargetPath = path.join(videoPath + ".mp4");
    fs.readFile(videoPath, async (readErr) => {
        if (readErr) {
            console.error('Error when reading file:', readErr);
            return res.status(500).send('Error when reading file');
        }
        console.log('Video saved successfully:' + videoPath);
        videoConverter_1.VideoConverter.convertVideo(videoPath, () => {
            res.sendFile(convertedTargetPath);
        });
    });
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
