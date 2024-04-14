import { VideoConverter } from "./videoConverter";
const express = require('express')
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const videoDirectory = path.join(__dirname, './videos');
app.use(cors())
app.use('./videos', express.static(videoDirectory));

// Ruta para cargar un video
app.post('/upload', (req, res) => {
  const videoName = req.body.name;
  const videoData = req.body.data;


  fs.writeFile(path.join(videoDirectory, videoName), videoData, (err) => {
    if (err) {
      console.error('Error al guardar el video:', err);
      res.status(500).send('Error al guardar el video');
    } else {
      console.log('Video guardado correctamente');
      res.send('Video guardado correctamente');
    }
  });

  VideoConverter.convertVideo(videoName)
});

// Ruta para obtener un video
app.get('/videos/:videoName', (req, res) => {
  const videoName = req.params.videoName;

  // Verificar si el video existe
  fs.access(path.join(videoDirectory, videoName), fs.constants.F_OK, (err) => {
    if (err) {
      console.error('El video no existe:', err);
      res.status(404).send('El video no existe');
    } else {
      // Enviar el video al cliente
      res.sendFile(path.join(videoDirectory, videoName));
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



