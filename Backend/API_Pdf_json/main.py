from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import requests
import threading
import json
import os
import fitz  # PyMuPDF

app = FastAPI()

from pdf2image import convert_from_path

def pdf_to_img(pdf_file_path, output_path, image_save_name):
    # Convert PDF to images using pdf2image
    images = convert_from_path(pdf_file_path, dpi=200)

    # Create the output directory if it doesn't exist
    os.makedirs(output_path, exist_ok=True)

    # Dictionary to store results for each page
    master_json = {}

    def get_icr_data(filepath, page_number):
        url = "https://iassistlabs.com/iail_icr"

        payload={}
        files=[
            ('file_upload', (filepath, open(filepath, 'rb'), 'image/jpeg'))
        ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.json()

    def process_page(page_number, image):
        image_path = os.path.join(output_path, f"image-{image_save_name}-{page_number}.png")
        image.save(image_path)

        # Call the get_icr_data function to process the image
        json_data = get_icr_data(image_path, page_number)

        # Store the JSON data in the master_json dictionary, mapped to the page number
        master_json[page_number] = json_data

    threads = []
    for page_number, image in enumerate(images, 1):
        t = threading.Thread(target=process_page, args=(page_number, image))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    # Save the master_json to a file if needed
    with open(os.path.join(output_path, "master_json.json"), 'w') as json_file:
        json.dump(master_json, json_file)

    return master_json

def pdf_to_img1(pdf_file_path, output_path, image_save_name):
    # Convert PDF to images using pdf2image
    images = convert_from_path(pdf_file_path, dpi=200)

    # Create the output directory if it doesn't exist
    os.makedirs(output_path, exist_ok=True)

    # Dictionary to store results for each page
    master_json = {}

    def get_icr_data(filepath, page_number):
        url = "https://iassistlabs.com/iail_icr"

        payload={}
        files=[
            ('file_upload', (filepath, open(filepath, 'rb'), 'image/jpeg'))
        ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.json()

    def process_page(page_number, image):
        image_path = os.path.join(output_path, f"image-{image_save_name}-{page_number}.png")
        image.save(image_path)

        # Call the get_icr_data function to process the image
        json_data = get_icr_data(image_path, page_number)
        text_json = json_data.get("lines")
        text = ""
        for i in range(len(text_json)):
            text += text_json[i].get("text")
        master_json[page_number] = text

    threads = []
    for page_number, image in enumerate(images, 1):
        t = threading.Thread(target=process_page, args=(page_number, image))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    # Save the master_json to a file if needed
    with open(os.path.join(output_path, "master_json.json"), 'w') as json_file:
        json.dump(master_json, json_file)

    return master_json

# text_json = text_json.get("lines")
# for i in range(len(text_json)):
#     text = text_json[i].get("text")
#     print(text)

@app.post("/upload")
async def upload_pdf_file(file1: UploadFile = File(...)):
    try:
        # Save the uploaded PDF file to a temporary location
        with open(file1.filename, "wb") as f:
            f.write(await file1.read())

        # Call the function to convert PDF to JSON
        json_result = pdf_to_img(file1.filename,"./","demo")
        print(json_result)

        return json_result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.post("/uploadtext")
async def upload_pdf_file(file1: UploadFile = File(...)):
    try:
        # Save the uploaded PDF file to a temporary location
        with open(file1.filename, "wb") as f:
            f.write(await file1.read())

        # Call the function to convert PDF to JSON
        json_result = pdf_to_img1(file1.filename,"./","demo")
        print(json_result)

        return json_result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
