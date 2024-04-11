import {
  EC2,
  RunInstancesCommand,
  TerminateInstancesCommand,
} from "@aws-sdk/client-ec2";
import {
  IAMClient,
  CreateRoleCommand,
  PutRolePolicyCommand,
  CreateInstanceProfileCommand,
  AddRoleToInstanceProfileCommand
} from "@aws-sdk/client-iam";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };

  const newRecord = event.Records[0].dynamodb.NewImage;
    console.log(newRecord)
  const userDataScript = `#!/bin/sh
        sudo su && yum install -y python3-pip && python3 -m pip install boto3 && aws s3 cp s3://fovus-challenge-script-for-ec2-bucket/ec2-script.py ec2-script.py && python3 ec2-script.py ${newRecord['id']['S']} && inst_id=$(ec2-metadata -i | awk '{print $2}') && aws ec2 terminate-instances --instance-ids $inst_id`
  
  try {
    const s3 = new S3Client({ region: "us-east-1" });
    const scriptFile = fs.readFileSync("ec2-script.py");

    const s3params = {
      Bucket: "fovus-challenge-script-for-ec2-bucket",
      Key: "ec2-script.py",
      Body: scriptFile,
    };
    await s3.send(new PutObjectCommand(s3params));
    console.log("Script successfully uploaded");
  } catch (error) {
    console.log("Error file accessing and pushing script file to s3 bucket");
  }

  const ec2 = new EC2({ region: "us-east-1" });
  const iam = new IAMClient({ region: "us-east-1" });

  /*const policy = {
    Statement: [
      { Effect: "Allow", Action: "s3:*", Resource: "*" },
      { Effect: "Allow", Action: "dynamodb:*", Resource: "*" },
    ],
  };

  const trusted_entity = {
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    }),
    RoleName: "S3DynamodbAccessToEC2Role3",
  };
  */
  let instanceId;
  try {
    /*const createRole = await iam.send(new CreateRoleCommand(trusted_entity));
    const instanceProfileParams = {
  InstanceProfileName: "S3DynamodbAccessToEC2Profile3",
  Roles: [createRole.Role.RoleName]
};
const createInstanceProfileResponse = await iam.send(new CreateInstanceProfileCommand(instanceProfileParams));
const addInstanceProfileToRoleParams = {
  InstanceProfileName: instanceProfileParams.InstanceProfileName,
  RoleName: createRole.Role.RoleName
};
await iam.send(new AddRoleToInstanceProfileCommand(addInstanceProfileToRoleParams));
    const rolePolicyParams = {
      PolicyDocument: JSON.stringify(policy),
      PolicyName: "S3DynamodbAccessToEC2Policy3",
      RoleName: "S3DynamodbAccessToEC2Role3",
    };
    await iam.send(new PutRolePolicyCommand(rolePolicyParams));*/
    const params = {
      ImageId: "ami-051f8a213df8bc089",
      InstanceType: "t2.micro",
      MinCount: 1,
      MaxCount: 1,
      IamInstanceProfile: {
        Arn: "arn:aws:iam::920646573603:instance-profile/fovusVMInstance"
      },
      KeyName: "fovusDemo",
      UserData: Buffer.from(userDataScript, 'utf-8').toString("base64")
    };
    const data = await ec2.send(new RunInstancesCommand(params));
    console.log("New EC2 instance created:", data);
    body = JSON.stringify(data);
    instanceId = data.Instances[0].InstanceId;
  } catch (err) {
    console.error("Error launching EC2 instance:", err);
    statusCode = 500;
    body = JSON.stringify({ error: "Failed to launch EC2 instance" });
  }
  // Terminating Instance

 /* try {
    await ec2.send(
      new TerminateInstancesCommand({ InstanceIds: [instanceId] })
    );
    console.log(`${instanceId} successfully terminated`);
  } catch (error) {
    console.log("Failed to terminate instance");
  }*/

  return {statusCode,headers,body}
};
