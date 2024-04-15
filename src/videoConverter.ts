
export class VideoConverter {
	static ffmpeg =  require("fluent-ffmpeg");
	constructor() { 
		VideoConverter.ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
	}

	static convertVideo(inputPath: string, func: Function): void {
        const outputPath  = this.getOutputFormat(inputPath)

		VideoConverter.ffmpeg(inputPath)
			.output(outputPath+".mp4")
			.format("mp4") 
			.on("end", () => {
				console.log("Video converted:"+outputPath);
				func()
			})
			.on("error", (err) => {
				console.error("Error while converting:", err);
			})
			.run();
	}
    private  static getOutputFormat(outputPath: string):string {
        return outputPath.split(".")[0]
    }
}
