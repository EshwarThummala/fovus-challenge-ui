import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { nanoid } from 'nanoid';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "fovus-challenge-input-table";

export const handler = async (event) => {
  // TODO implement
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type', // Allow only specific headers
    'Access-Control-Allow-Methods': 'OPTIONS,POST' // Allow only specific methods
  };
  try{
  let random_id = nanoid(7);
  const parsedbody = JSON.parse(event.body)
  await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: random_id,
              input_text: parsedbody.input_text,
              input_file_path: parsedbody.input_file_path,
            },
          })
        );
        body = random_id
  }
  catch(error){
    statusCode = 400
    body = error.message 
  }
  finally{
    body =JSON.stringify({"id": body})
  }

  return {statusCode,headers, body};
};
