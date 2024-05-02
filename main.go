package main

import (
	"fmt"
	"github.com/rs/cors"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"server-video-converter/video_funcs"
	"time"
)

func main() {
	port := "3000"

	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/upload", uploadHandle)

	c := cors.AllowAll()
	handler := c.Handler(mux)

	fmt.Println("Server is up and running at http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func uploadHandle(res http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	file, handler, err := req.FormFile("video")
	format := req.Form.Get("format")

	if err != nil {
		http.Error(res, "Error receiving the file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	tempDir := "./uploads"
	if _, err := os.Stat(tempDir); os.IsNotExist(err) {
		os.Mkdir(tempDir, 0755)
	}

	tempFilePath := filepath.Join(tempDir, time.Now().Format("20060102150405")+handler.Filename)

	tempFile, err := os.Create(tempFilePath)
	if err != nil {
		http.Error(res, "Error creating the temporary file", http.StatusInternalServerError)
		fmt.Println("Error creating the temporary file: ", err)
		return
	}

	defer func() {
        tempFile.Close()
        os.Remove(tempFilePath)
    }()

	_, err = io.Copy(tempFile, file)
	if err != nil {
		http.Error(res, "Error copying the file", http.StatusInternalServerError)
		fmt.Println("Error copying the file: ", err)
		return
	}
	fmt.Println("video received successfully " + tempFilePath)
	tempFile.Close()

	outputPath := tempFilePath + "." + format
	defer os.Remove(outputPath)

	if err := video_funcs.ConvertVideo(tempFilePath, outputPath); err != nil {
		http.Error(res, "Error converting the video", http.StatusInternalServerError)
		fmt.Println("Error converting the video: ", err)
		return
	}

	fmt.Println("video converted successfully "+ outputPath)

	http.ServeFile(res, req, tempFilePath+"."+format)

}
