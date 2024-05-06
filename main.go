package main

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"server-video-converter/video_funcs"
	"time"

	"github.com/rs/cors"
)

const tempDir = "./uploads"

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

	err := req.ParseMultipartForm(0)
	if err != nil {
		http.Error(res, "Error receiving files", http.StatusInternalServerError)
		return
	}
	
	files := req.MultipartForm.File["video"]
	
	format := req.Form.Get("format")
	
	if _, err := os.Stat(tempDir); os.IsNotExist(err) {
		os.Mkdir(tempDir, 0755)
	}

	var tempFilePathsList []string

	for _ , file := range files {
		tempFilePath, err := createTempPath(file, res)
		defer os.Remove(tempFilePath)

		if err != nil {
			fmt.Println("Error converting the video: ", err)
			return
		}

		tempFilePathsList = append(tempFilePathsList, tempFilePath)
	}


	if err := video_funcs.ConvertVideo(tempFilePathsList, format); err != nil {
		http.Error(res, "Error converting the video", http.StatusInternalServerError)
		fmt.Println("Error converting the video: ", err)
		return
	}

	fmt.Println("videos converted successfully ")

	mw := multipart.NewWriter(res)
	res.Header().Set("Content-Type", mw.FormDataContentType())

	for _, tempFilePath := range tempFilePathsList {
		
		outputPath := tempFilePath + "." + format

		defer os.Remove(outputPath)

		file, err := os.Open(outputPath)

		if err != nil {
			http.Error(res, "Error opening video file", http.StatusInternalServerError)
			fmt.Println("Error opening video file: ", err)
			return
		}

		defer file.Close()

		part, err := mw.CreateFormFile("videos", filepath.Base(tempFilePath))
		if err != nil {
			http.Error(res, "Error creating form file", http.StatusInternalServerError)
			fmt.Println("Error creating form file: ", err)
			return
		}

		_, err = io.Copy(part, file)
		if err != nil {
			http.Error(res, "Error copying file to form file", http.StatusInternalServerError)
			fmt.Println("Error copying file to form file: ", err)
			return
		}
	}

	mw.Close()
}

func createTempPath(file *multipart.FileHeader,  res http.ResponseWriter) (string, error) {
	uploadedFile, err := file.Open()
	
	if err != nil {
		http.Error(res, "Error opening the temporary file", http.StatusInternalServerError)
		fmt.Println("Error opening the temporary file: ", err)
		return "", err
	}

	defer uploadedFile.Close()
	
	tempFilePath := filepath.Join(tempDir, time.Now().Format("20060102150405")+ file.Filename)
	tempFile, err := os.Create(tempFilePath)
	
	if err != nil {
		http.Error(res, "Error creating the temporary file", http.StatusInternalServerError)
		fmt.Println("Error creating the temporary file: ", err)
		return "", err
	}
	defer tempFile.Close()
	

	_, err = io.Copy(tempFile, uploadedFile)
	if err != nil {
		http.Error(res, "Error copying the file", http.StatusInternalServerError)
		fmt.Println("Error copying the file: ", err)
		return "", err
	}
	
	return tempFilePath, err
}
