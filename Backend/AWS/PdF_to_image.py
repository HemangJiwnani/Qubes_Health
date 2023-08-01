# import module
from http.client import BAD_REQUEST
from pdf2image import convert_from_path
import requests
import time
import urllib.parse
import urllib.error
import json
import os
import fitz
import threading

def get_icr_data(image_url):
    """
    Passes the image url to IAIL cognitive services (ICR) and gets the interpreted data
    extracted from the image in the image url and returns a json data
    :param image_url:
            url of the image in cloud
    :type image_url: str
    :return: Interpreted data
    :rtype: dict
    """
    subscription_key = "665d4d9af50043ce91135e526a1f41ca"
    text_recognition_url = "https://icr-prod-sh-1.cognitiveservices.azure.com/" + "vision/v2.1/read/core/asyncBatchAnalyze?language=en"

    headers = {'Ocp-Apim-Subscription-Key': subscription_key}
    data = {'url': image_url}
    params = urllib.parse.urlencode({
        'language': 'en',
        'detectOrientation ': 'true',
    })
    response = requests.post(text_recognition_url, headers=headers, params=params, json=data)
    response.raise_for_status()

    # operation_url = response.headers["Operation-Location"]

    analysis = {}
    poll = True
    while poll:
        response_final = requests.get(
            response.headers["Operation-Location"], headers=headers, params=params)
        analysis = response_final.json()
        time.sleep(1)
        if "recognitionResults" in analysis:
            poll = False
        if "status" in analysis and analysis['status'] == 'Failed':
            poll = False

    text_json = analysis['recognitionResults'][0].get("lines")
    return text_json
 
def get_icr_data_from_image(filepath: str):
    from os.path import basename, dirname
    image_path = filepath
    file_name = basename(filepath)
    payload = {}
    files = [('file_upload', (file_name, open(image_path, 'rb'), 'image/jpeg'))]
    headers = {}
    try:
        url = "https://iassistlabs.com/star_icr"
        print("get_images from star_icr")
        response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
        if response.status_code == 200:
            return response.json()
        else:
            try:
                url = "https://claimsftr.com/api/V1/star_icr"
                response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
                print(f"get_images from star_icr {response.status_code}")
                if response.status_code == 200:
                    return response.json()
                else:
                    try:
                        url = "https://api.iailclaimftr.com/api/V1/star_icr"
                        response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
                        if response.status_code == 200:
                            return response.json()
                        else:
                            raise BAD_REQUEST("All Server's Are Down")
                    except:
                        raise BAD_REQUEST("All Server's Are Down")
            except:
                try:
                    url = "https://api.iailclaimftr.com/api/V1/star_icr"
                    response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
                    print(f"get_images from star_icr in exception1 {response.status_code}")
                    if response.status_code == 200:
                        return response.json()
                    else:
                        raise BAD_REQUEST("Server Is Down")
                except:
                    raise BAD_REQUEST("All Server's Are Down")
    except:
        try:
            url = "https://claimsftr.com/api/V1/star_icr"
            response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
            print(f"get_images from star_icr in exception2 {response.status_code}")
            if response.status_code == 200:
                return response.json()
            else:
                try:
                    url = "https://api.iailclaimftr.com/api/V1/star_icr"
                    response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
                    if response.status_code == 200:
                        return response.json()
                    else:
                        raise BAD_REQUEST("All Server's Are Down")
                except:
                    raise BAD_REQUEST("All Server's Are Down")
        except:
            try:
                url = "https://api.iailclaimftr.com/api/V1/star_icr"
                response = requests.request("POST", url, headers=headers, data=payload, files=files, verify=True)
                print(f"get_images from star_icr in exception3 {response.status_code}")
                if response.status_code == 200:
                    return response.json()
                else:
                    raise BAD_REQUEST("All Server's Are Down")
            except:
                raise BAD_REQUEST("All Server's Are Down")
import re
import os
import numpy as np

def iail_icr(filepath):
    url = "https://iassistlabs.com/iail_icr"

    payload={}
    files=[
  ('file_upload',(os.path.join(filepath),open(filepath,'rb'),'image/jpeg'))
]
    headers = {}

    response = requests.request("POST", url, headers=headers, data=payload, files=files)
    return response.json()

# def process_pdf_and_get_icr_data(pdf_file_path):
#     zoom = 2  # zoom factor
#     mat = fitz.Matrix(zoom, zoom)
#     doc = fitz.open(pdf_file_path)
#     for page in doc:
#         pix = page.getPixmap(matrix=mat)
#         threading.Thread(target=pix.writePNG,args=(str("./temp_images") + "/image-{}-{}.png".format(image_save_name, page.number),)).start()
    
#     # os.makedirs(temp_folder, exist_ok=True)
#     # temp_folder = "./temp_images"

#     master_json = {}  # Master JSON to store the ICR data mapped to page number

#     for i, image in enumerate(images):
#         # Save pages as images in the temporary folder
#         image_path = os.path.join(temp_folder, f'page{i}.jpg')
#         image.save(image_path, 'JPEG')

#         # Call the get_icr_data function to process the image and get the JSON data
#         icr_data = iail_icr(image_path)

#         # Add the JSON data to the master JSON, mapped to the page number
#         master_json[f"page{i}"] = icr_data

#     # Remove the temporary folder and its contents after processing all images
#     for file in os.listdir(temp_folder):
#         file_path = os.path.join(temp_folder, file)
#         os.remove(file_path)
#     os.rmdir(temp_folder)

#     return master_json
# def pdf_to_img(pdf_file_path):
#     output_path = "./"
#     zoom = 2  # zoom factor
#     mat = fitz.Matrix(zoom, zoom)
#     doc = fitz.open(pdf_file_path)

#     # Dictionary to store results for each page
#     master_json = {}

#     def get_icr_data(filepath):
#        url = "https://iassistlabs.com/iail_icr"
#        payload={}
#        files=[
#   			('file_upload',(os.path.join(filepath),open(filepath,'rb'),'image/jpeg'))
# 		]
#        headers = {}
#        response = requests.request("POST", url, headers=headers, data=payload, files=files)
#        return response.json()

#     def process_page(page):
#         pix = page.getPixmap(matrix=mat)
#         image_path = str(output_path) + "/image-{}-{}.png".format("Demo", page.number)
#         pix.writePNG(image_path)

#         # Call the get_icr_data function to process the image
#         text_json = get_icr_data(image_path)
#         text_json = text_json.get("lines")
#         text = ""
#         for i in range(len(text_json)):
#             text += text_json[i].get("text")
#         # Store the JSON data in the master_json dictionary, mapped to the page number
#         master_json["Page " + str(page.number)] = text

#     threads = []
#     for page in doc:
#         t = threading.Thread(target=process_page, args=(page,))
#         t.start()
#         threads.append(t)

#     for t in threads:
#         t.join()

#     # Save the master_json to a file if needed
#     with open(str(output_path) + "/master_json.json", 'w') as json_file:
#         json.dump(master_json, json_file)

#     return master_json

def pdf_to_img(pdf_file_path):
    output_path = "./"
    zoom = 2  # zoom factor
    doc_images = convert_from_path(pdf_file_path, dpi=200, grayscale=True)

    # Dictionary to store results for each page
    master_json = {}

    def get_icr_data(filepath):
        url = "https://iassistlabs.com/iail_icr"

        payload={}
        files=[
    ('file_upload',(os.path.join(filepath),open(filepath,'rb'),'image/jpeg'))
    ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.json()

    def process_page(page_number, image):
        image_path = str(output_path) + "/image-{}-{}.png".format("Demo", page_number)
        image.save(image_path)

        # Call the get_icr_data function to process the image
        text_json = get_icr_data(image_path)
        text_json = text_json.get("lines")
        text = ""
        for i in range(len(text_json)):
            text += text_json[i].get("text")
        # Store the JSON data in the master_json dictionary, mapped to the page number
        master_json["Page " + str(page_number)] = text

    threads = []
    for page_number, image in enumerate(doc_images, start=1):
        t = threading.Thread(target=process_page, args=(page_number, image))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    # Save the master_json to a file if needed
    with open(str(output_path) + "/master_json.json", 'w') as json_file:
        json.dump(master_json, json_file)

    return master_json

if __name__ == "__main__":
    pdf_file_path = '/Users/hemangjiwnani/Desktop/Projects/IAIL/Qubes/Data/607321923120116668[9693].pdf'
    result_json = pdf_to_img(pdf_file_path)
    print(result_json)
    # You can now use the result_json containing the ICR data for each page
    json.dumps(result_json, indent=4)