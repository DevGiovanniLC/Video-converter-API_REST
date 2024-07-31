<div align="center">
  <img src="https://github.com/user-attachments/assets/fda38f2e-1026-4612-8fa9-5e281304921f" width="250" height="250"/>
</div>

# Video Converter (API_REST)

API Rest orientada a la conversión de videos, donde unicamente la compone un endpoint.

GET "/upload"

Donde como petición se le pasa un formulario compuesto de un video tipo Blob y una string que indica el formato a convertir el video. 
Como respuesta a la petición HTTP devuelve el video convertido al formato indicado.

Para esa conversión usa el software FFmpeg de uso libre.

En el branch principal está hecho con golang y la libreria nativa del mismo para gestión de peticiones http.
Hay una rama secundaria hecha con NodeJS pero destinada a la conversión a mp4 hecha con expressJS.
