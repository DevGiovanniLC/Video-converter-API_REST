package video_funcs

import (
	"os/exec"
)

func ConvertVideo(inputPath string,  outputPath string) error  {
    cmd := exec.Command("./bin/ffmpeg", "-i", inputPath, outputPath)
    return cmd.Run()
}