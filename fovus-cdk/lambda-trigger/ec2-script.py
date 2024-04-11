import boto3
import sys

region = "us-east-1"
input_table_name = "fovus-challenge-input-table"
id = sys.argv[1]
output_table_name = "fovus-challenge-output-table"

s3 = boto3.client('s3',region_name=region)
dynamodb = boto3.resource('dynamodb', region_name=region)
input_table = dynamodb.Table(input_table_name)
try:
        input_record = input_table.get_item(Key = {'id': id})
        if 'Item' in input_record:
                item = input_record['Item']
                input_file_path = item['input_file_path']
                input_text =  item['input_text']
                bucket_name, key = input_file_path.split("/")
                s3.download_file(bucket_name, key, key)
                print("File Downloaded")
                with open(key, 'a') as file:
                        file.write(' : '+input_text)
                print("Input Text Appended")
                file.close()
                s3.upload_file(key, bucket_name, 'output'+key)
                print("File Uploaded")
                output_table = dynamodb.Table(output_table_name)
                output_table.put_item(Item={'id':id, 'output_file_path': bucket_name+'/output'+key})
                print("Record created in output table")
        else:
                print("Item not found")
except Exception as  e:
        print(e)