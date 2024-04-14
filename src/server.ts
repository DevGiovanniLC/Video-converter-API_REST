import { VideoConverter } from "./videoConverter";
const express = require('express')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

const videoDirectory = path.join(__dirname, './videos');
app.use(cors())
app.use('./videos', express.static(videoDirectory));

// Ruta para cargar un video
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se proporcionó ningún archivo');
  }

  const videoPath = req.file.path; // Ruta temporal del archivo de video
  const targetPath = path.join(__dirname, 'videos', req.file.originalname); // Ruta donde se guardará el archivo

  // Leer el archivo de video desde su ruta temporal
  fs.readFile(videoPath, (readErr, data) => {
    if (readErr) {
      console.error('Error al leer el archivo:', readErr);
      return res.status(500).send('Error al leer el archivo');
    }

    // Guardar el archivo de video en el directorio de videos
    fs.writeFile(targetPath, data, (writeErr) => {
      if (writeErr) {
        console.error('Error al guardar el archivo:', writeErr);
        return res.status(500).send('Error al guardar el archivo');
      }
    });

  });

  console.log('Video guardado correctamente');
  VideoConverter.convertVideo(targetPath).then( _ => {
    fs.access(path.join(videoDirectory, "blob.mp4"), fs.constants.F_OK, (err) => {
      if (err) {
        console.error('El video no existe:', err);
        res.status(404).send('El video no existe');
      } else {
        res.sendFile(path.join(videoDirectory, "blob.mp4"));
      }
    });
    
  });

});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



