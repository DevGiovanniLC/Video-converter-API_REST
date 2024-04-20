import { VideoConverter } from './videoConverter';
// import { injectSpeedInsights } from '@vercel/speed-insights';
// injectSpeedInsights();
const express = require('express')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;
const app = express();
app.use(cors({origin:"http://localhost:4200"}))

const upload = multer({ dest: __dirname + '/uploads/' });
app.use('./videos', express.static("dist/uploads/"));

app.post('/upload', upload.single('video'),  (req: any, res: any) => {
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
        VideoConverter.convertVideo(videoPath, req.body.format, () => {
            res.sendFile(convertedTargetPath)
        })
    });


});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports=app



