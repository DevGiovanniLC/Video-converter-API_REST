"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const videoConverter_1 = require("./videoConverter");
// import { injectSpeedInsights } from '@vercel/speed-insights';
// injectSpeedInsights();
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: "http://localhost:4200" }));
const upload = multer({ dest: __dirname + '/uploads/' });
app.use('./videos', express.static("dist/uploads/"));
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send(' No file was uploaded');
    }
    const videoPath = req.file.path;
    const convertedTargetPath = path.join(videoPath + ".mp4");
    fs.readFile(videoPath, (readErr) => __awaiter(void 0, void 0, void 0, function* () {
        if (readErr) {
            console.error('Error when reading file:', readErr);
            return res.status(500).send('Error when reading file');
        }
        console.log('Video saved successfully:' + videoPath);
        videoConverter_1.VideoConverter.convertVideo(videoPath, req.body.format, () => {
            res.sendFile(convertedTargetPath);
        });
    }));
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
module.exports = app;
