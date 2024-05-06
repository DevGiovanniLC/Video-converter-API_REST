package video_funcs

import (
	"testing"
)

func TestConvertVideo(t *testing.T) {

	var fileList  []string ;

	fileList = append(fileList, "testing_assets/video.mkv")

	err := ConvertVideo(fileList,  "mp4")

	if err != nil {
		t.Error("TestConvertVideo", err)
	}
	
}