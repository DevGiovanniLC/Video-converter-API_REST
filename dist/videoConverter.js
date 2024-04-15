"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConverter = void 0;
class VideoConverter {
    static ffmpeg = require("fluent-ffmpeg");
    constructor() {
        VideoConverter.ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
    }
    static convertVideo(inputPath, func) {
        const outputPath = this.getOutputFormat(inputPath);
        VideoConverter.ffmpeg(inputPath)
            .output(outputPath + ".mp4")
            .format("mp4")
            .on("end", () => {
            console.log("Video converted:" + outputPath);
            func();
        })
            .on("error", (err) => {
            console.error("Error while converting:", err);
        })
            .run();
    }
    static getOutputFormat(outputPath) {
        return outputPath.split(".")[0];
    }
}
exports.VideoConverter = VideoConverter;
