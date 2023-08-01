import boto3
from botocore.exceptions import ClientError

def generate_presigned_url(bucket_name, object_name, expiration=3600):
    """
    Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid (default is 3600 seconds / 1 hour)
    :return: Presigned URL as string. If error, returns None.
    """

    # Create an S3 client
    s3_client =  boto3.client(
            's3',
            aws_access_key_id="AKIARWQZ4LWKKXND7W75",
            aws_secret_access_key='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',
            region_name='ap-south-1'
    )

    try:
        content_type = "application/pdf"
        params = {'Bucket': bucket_name, 'Key': object_name}
        if content_type:
            params['ResponseContentType'] = content_type
        response = s3_client.generate_presigned_url(
            'get_object',
            Params=params,
            ExpiresIn=expiration,
        )

    except ClientError as e:
        print(f"Error generating presigned URL: {e}")
        return None

    return response

def main():
    # Replace 'your-bucket-name' and 'your-object-key' with your actual S3 bucket and object path
    bucket_name = 'qubesbillsystem'
    object_key = 'bill_1.pdf'
    # https://qubesbillsystem.s3.ap-south-1.amazonaws.com/bill_1.pdf
    # '62', 'https://qubesbillsystem.s3.ap-south-1.amazonaws.com/bill_1.pdf', 'lqhcOLnK', 'bill_1.pdf', '2023-07-27 12:03:39', NULL, 'Iassist', 'demo', '9207023603', 'Hemang.jiwnani@iail.in', 'demo', '2000', '3000', 'continental', 'ksksk'

    
    presigned_url = generate_presigned_url(bucket_name, object_key)

    if presigned_url is not None:
        print("Presigned URL:", presigned_url)

if __name__ == "__main__":
    main()
