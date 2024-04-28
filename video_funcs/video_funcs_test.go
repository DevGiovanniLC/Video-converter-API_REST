package video_funcs

import (
	"testing"
)

func TestConvertVideo(t *testing.T) {
	err := ConvertVideo("testing_assets/test",  "mp4")
	if err != nil {
		t.Error("TestConvertVideo", err)
	}
}