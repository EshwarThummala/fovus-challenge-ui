import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as gatewayAPI from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { truncate } from "fs/promises";
import { ApiBase } from "aws-cdk-lib/aws-apigatewayv2/lib/common/base";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FovusCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fovusUserPool = new cognito.UserPool(this, "fovus-user-pool", {
      userPoolName: "fovus-user-pool",
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
        tempPasswordValidity: cdk.Duration.days(7),
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const fovusUserPoolClient = new cognito.UserPoolClient(
      this,
      "fovus-user-pool-client",
      {
        userPool: fovusUserPool,
        generateSecret: false,
      }
    );

    const fovusIdentityPool = new cognito.CfnIdentityPool(
      this,
      "fovus-identity-pool",
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: fovusUserPoolClient.userPoolClientId,
            providerName: fovusUserPool.userPoolProviderName,
          },
        ],
      }
    );

    const fovusCognitoUserRole = new iam.Role(
      this,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": fovusIdentityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    fovusCognitoUserRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["cognito-sync:*", "cognito-identity:*"],
        resources: ["*"],
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: fovusIdentityPool.ref,
        roles: { authenticated: fovusCognitoUserRole.roleArn },
      }
    );

    const fovusS3Bucket = new s3.Bucket(
      this,
      "eshwar-fovus-challenge-bucket-s3",
      {
        bucketName: "eshwar-fovus-challenge-bucket-s3",
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        cors: [
          {
            allowedOrigins: ["*"],
            allowedMethods: [
              s3.HttpMethods.GET,
              s3.HttpMethods.PUT,
              s3.HttpMethods.HEAD,
            ],
            allowedHeaders: ["*"],
          },
        ],
      }
    );

    const fovusEC2ScriptBucket = new s3.Bucket(
      this,
      "fovus-challenge-script-for-ec2-bucket",
      {
        bucketName: "fovus-challenge-script-for-ec2-bucket",
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        cors: [
          {
            allowedOrigins: ["*"],
            allowedMethods: [
              s3.HttpMethods.GET,
              s3.HttpMethods.PUT,
              s3.HttpMethods.HEAD,
            ],
            allowedHeaders: ["*"],
          },
        ],
      }
    );

    fovusCognitoUserRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      })
    );

    const fovusTable = new dynamodb.Table(this, "fovus-challenge-input-table", {
      tableName: "fovus-challenge-input-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    const fovusOutputTable = new dynamodb.Table(
      this,
      "fovus-challenge-output-table",
      {
        tableName: "fovus-challenge-output-table",
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const roleToStopAndExecuteEC2 = new iam.Role(this, "lambdaTriggerEC2Role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    roleToStopAndExecuteEC2.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ec2:RunInstances",
          "ec2:TerminateInstances",
          "s3:PutObject",
          "s3:GetBucketLocation",
          "s3:ListBucket",
          "logs:PutLogEvents",
          "logs:CreateLogStream",
          "iam:PassRole",
        ],
        resources: ["*"],
      })
    );

    const triggerLambda = new lambda.Function(this, "fovus-trigger-lambda", {
      functionName: "fovus-trigger-lambda",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda-trigger/index.zip"),
      timeout: cdk.Duration.seconds(10),
      role: roleToStopAndExecuteEC2,
    });

    triggerLambda.addEventSource(
      new DynamoEventSource(fovusTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
      })
    );

    const fovusVMRole = new iam.Role(this, "fovusVMRole", {
      roleName: "fovusVMRole",
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    fovusVMRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    fovusVMRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    fovusVMRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess")
    );

    new iam.CfnInstanceProfile(this, "fovusVMInstance", {
      instanceProfileName: "fovusVMInstance",
      roles: [fovusVMRole.roleName],
    });

    const fovusLambda = new lambda.Function(this, "fovus-lambda-function", {
      functionName: "fovus-lambda-function",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("nanoid/index.zip"),
      timeout: cdk.Duration.seconds(10),
    });

    fovusTable.grantWriteData(fovusLambda);

    const fovusAPI = new gatewayAPI.RestApi(this, "fovus-gateway-api", {
      restApiName: "fovus-gateway-api",
      deploy: true,
      deployOptions: {
        stageName: "final",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
      },
    });

    const cognitoAPIAuthorizer = new gatewayAPI.CognitoUserPoolsAuthorizer(
      this,
      "fovus-coginto-userpool-authorizer",
      {
        authorizerName: "fovus-coginto-userpool-authorizer",
        cognitoUserPools: [fovusUserPool],
      }
    );

    const fovusLambdaIntegration = new gatewayAPI.LambdaIntegration(
      fovusLambda
    );
    fovusAPI.root.addMethod("POST", fovusLambdaIntegration, {
      authorizer: cognitoAPIAuthorizer,
      authorizationType: gatewayAPI.AuthorizationType.COGNITO,
    });
  }
}
