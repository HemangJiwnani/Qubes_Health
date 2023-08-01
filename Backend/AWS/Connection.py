from fastapi import FastAPI, UploadFile, File
import boto3
import requests
import os
from os import environ
from os import environ as env
import pymysql
from dotenv import load_dotenv
import string
import random
from datetime import datetime
from pydantic import BaseModel

load_dotenv()
app = FastAPI()

"""
    Input Which Company Will Pass:- 
    Company Name/ID
    Employee Name
    Employee Mobile Number
    Employee email_id
    Patient Name 
    Requested amount
    Estimate Amount
"""
class DataType(BaseModel):
    filen: str
    company_name: str
    employee_name: str
    employee_mobile_number: str
    employee_email_id: str
    patient_name: str
    requested_amount: int
    estimate_amount: int
    qlink: str

"""
Sample JSON Input:- 
{
    "company_name" : "Iassist",
    "employee_name" : "Rahul",
    "employee_mobile_number" : "+91 63780-41707",
    "employee_email_id" : "Hemang.jiwnani@iail.in",
    "patient_name" : "Pawan",
    "requested_amount" : 2000,
    "estimate_amount" : 3000,
    "qlink": "https://qubesdemo.s3.eu-north-1.amazonaws.com/Hemang_jiwnanj.pdf"
}
"""

def mysqlconnect(gname,filen):
    # To connect MySQL database
    conn = pymysql.connect(
        host="164.52.212.196",
        user="iailDataMining",
        password="CUWDUY@xjhjh8971",
        database="qubes"
    )

    cur = conn.cursor()
    print("$============$")
    print(gname + "  " + filen)
    print("$============$")
    cur.execute("USE qubes;")  # Switch to the "qubes" database
    print(cur.execute("SELECT * FROM File"))
    cur.execute(f"UPDATE File SET ReferenceId = '{gname}' WHERE FileName = '{filen}';")
    conn.commit()
    output = cur.fetchall()
    print(output)

    conn.close()

def generate_reference_id(length=8):
    alphanumeric = string.ascii_letters + string.digits
    return ''.join(random.choices(alphanumeric, k=length))

@app.post("/upload")
async def upload_file(data: DataType):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=os.environ['aws_access_key_id'],
            aws_secret_access_key=os.environ['aws_secret_access_key'],
            region_name=os.environ['aws_region']
        )
        print(os.environ['destination_bucket_name'])
        # validate_link(link)
        source_file_link = data.qlink
        bucket_name = source_file_link.split('/')[2]
        key = '/'.join(source_file_link.split('/')[3:])
        # print(source_file_link)
        response = requests.get(source_file_link)
        # print("Me: " + bucket_name)
        # print("Key : " + "".join(source_file_link.split('/')[3:]))
        # response.raise_for_status()  # Raise exception for non-2xx response status codes
        file_content = response.content
        # print("Data" + str(file_content))
        destination_bucket_name = os.environ['destination_bucket_name']
        destination_key = key
        s3.put_object(Body=file_content, Bucket=destination_bucket_name, Key=destination_key)
        print("File downloaded and uploaded successfully!")
        # Generate reference ID
        reference_id = generate_reference_id()
        file_nam = "".join(source_file_link.split('/')[3:])
        print(reference_id + "    " + file_nam)
        mysqlconnect(reference_id,file_nam)
        # Get upload initiation and completion time
        upload_initiation_time = datetime.now().isoformat()
        upload_completion_time = datetime.now().isoformat()

        # Construct JSON response
        response_data = {
            "message": "Upload Successful",
            "reference_id": reference_id,
            "upload_initiation_time": upload_initiation_time,
            "upload_completion_time": upload_completion_time
        }

        # Return the JSON response
        return response_data
    
    except (requests.exceptions.RequestException, KeyError) as e:
        print("Error:", str(e))
        print("Failed")
        return {"message": "Upload Failed" + str(e)}
