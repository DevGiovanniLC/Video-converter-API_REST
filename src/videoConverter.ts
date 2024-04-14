
export class VideoConverter {
	static ffmpeg =  require("fluent-ffmpeg");
	constructor() { 
		VideoConverter.ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
	}

	static convertVideo(inputPath: string) {
        const outputPath  = this.getOutputFormat(inputPath)

		VideoConverter.ffmpeg(inputPath)
			.output(outputPath+".mp4")
			.format("mp4") 
			.on("end", () => {
				console.log("Conversión completa");
			})
			.on("error", (err) => {
				console.error("Error al convertir el archivo:", err);
			})
			.run();
	}
    private  static getOutputFormat(outputPath: string):string {
        return outputPath.split(".")[0]
    }
}
