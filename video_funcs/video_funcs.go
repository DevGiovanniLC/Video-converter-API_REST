package video_funcs

import (
	"os/exec"
)

func ConvertVideo(inputPaths []string, format string) error  {
	var command = "./bin/ffmpeg"

	for _, inputPath := range inputPaths {
		outputPath := inputPath + "." + format
		command = command + " -i " + inputPath + " " + outputPath
	}
	
    cmd := exec.Command(command)

    return cmd.Run()
}