import { VideoConverter } from "./videoConverter";
const express = require('express')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const upload = multer({ dest: __dirname + '/uploads/' });
app.use(cors())
app.use('./videos', express.static("dist/uploads/"));

app.post('/upload', upload.single('video'),  (req: { file: { path: any; originalname: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; sendFile: (arg0: any) => void; }) => {
    if (!req.file) {
        return res.status(400).send(' No file was uploaded');
    }

    const videoPath = req.file.path
    const convertedTargetPath = path.join(videoPath + ".mp4");

    fs.readFile(videoPath, async (readErr: any) => {
        if (readErr) {
            console.error('Error when reading file:', readErr);
            return res.status(500).send('Error when reading file');
        }

        console.log('Video saved successfully:' + videoPath);
        VideoConverter.convertVideo(videoPath, () => {
            res.sendFile(convertedTargetPath);
        })
    });


});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});



