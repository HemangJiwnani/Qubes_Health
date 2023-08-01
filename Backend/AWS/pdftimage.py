import fitz
import threading
import requests
import os

class PdfToImage():
    def iail_icr(filepath):
        url = "https://iassistlabs.com/iail_icr"

        payload={}
        files=[
    ('file_upload',(os.path.join(filepath),open(filepath,'rb'),'image/jpeg'))
    ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.json()

    def pdf_to_img(pdf_file_path,output_path,image_save_name):
        zoom = 2  # zoom factor
        mat = fitz.Matrix(zoom, zoom)
        doc = fitz.open(pdf_file_path)
        for page in doc:
            pix = page.getPixmap(matrix=mat)
            threading.Thread(target=pix.writePNG,args=(str(output_path) + "/image-{}-{}.png".format(image_save_name, page.number),)).start()
        # return len(doc)

pdf_file_path = "/Users/hemangjiwnani/Desktop/Projects/IAIL/Qubes/Data/607321923120116668[9693].pdf"
output_path = "./"
image_save_image = "demo"
PdfToImage.pdf_to_img(pdf_file_path,output_path,image_save_image)
# text_json = PdfToImage.iail_icr("/Users/hemangjiwnani/Desktop/Projects/IAIL/Qubes/Website/Backend/AWS/image-demo-0.png")
# text_json = text_json.get("lines")
# for i in range(len(text_json)):
#     text = text_json[i].get("text")
#     print(text)



def pdf_to_img(pdf_file_path, output_path, image_save_name):
    zoom = 2  # zoom factor
    mat = fitz.Matrix(zoom, zoom)
    doc = fitz.open(pdf_file_path)

    # Dictionary to store results for each page
    master_json = {}

    def get_icr_data(filepath, page_number):
        url = "https://iassistlabs.com/iail_icr"

        payload={}
        files=[
    ('file_upload',(os.path.join(filepath),open(filepath,'rb'),'image/jpeg'))
    ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.json()

    def process_page(page):
        pix = page.getPixmap(matrix=mat)
        image_path = str(output_path) + "/image-{}-{}.png".format(image_save_name, page.number)
        pix.writePNG(image_path)

        # Call the get_icr_data function to process the image
        json_data = get_icr_data(image_path, page.number)

        # Store the JSON data in the master_json dictionary, mapped to the page number
        master_json[page.number] = json_data

    threads = []
    for page in doc:
        t = threading.Thread(target=process_page, args=(page,))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    # Save the master_json to a file if needed
    with open(str(output_path) + "/master_json.json", 'w') as json_file:
        json.dump(master_json, json_file)

    return master_json

# Example usage:
pdf_file_path = "path/to/your/pdf_file.pdf"
output_path = "path/to/your/output_folder"
image_save_name = "output_image"

result_json = pdf_to_img(pdf_file_path, output_path, image_save_name)
print(result_json)
