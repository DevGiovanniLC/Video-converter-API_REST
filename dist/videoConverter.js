"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConverter = void 0;
class VideoConverter {
    static ffmpeg = require("fluent-ffmpeg");
    constructor() {
        VideoConverter.ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
    }
    static convertVideo(inputPath) {
        const outputPath = this.getOutputFormat(inputPath);
        VideoConverter.ffmpeg(inputPath)
            .output(outputPath + ".mp4")
            .format("mp4")
            .on("end", () => {
            console.log("Conversión completa");
        })
            .on("error", (err) => {
            console.error("Error al convertir el archivo:", err);
        })
            .run();
    }
    static getOutputFormat(outputPath) {
        return outputPath.split(".")[0];
    }
}
exports.VideoConverter = VideoConverter;
