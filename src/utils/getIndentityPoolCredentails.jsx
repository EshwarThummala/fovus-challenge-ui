import aws from "aws-sdk";
import { CognitoIdentity } from "aws-sdk";

const region = "us-east-1";
aws.config.update({ region: region });
const cognitoIdentity = new CognitoIdentity();

export async function getCognitoCredentials(idToken, setTokens) {
  const params = {
    IdentityPoolId: "us-east-1:fac97073-343c-47c8-8638-c7eb55c0366f",
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_MSr8YU7RL": idToken,
    },
  };
  const cognitoIdentityId = await cognitoIdentity.getId(params).promise();
  const paramsForCredentials = {
    IdentityId: cognitoIdentityId.IdentityId,
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_MSr8YU7RL": idToken,
    },
  };
  const credentialsResponse = await cognitoIdentity
    .getCredentialsForIdentity(paramsForCredentials)
    .promise();
  const { AccessKeyId, SecretKey, SessionToken } =
    credentialsResponse.Credentials;
  setTokens({
    accessKeyId: AccessKeyId,
    secretAccessKey: SecretKey,
    sessionToken: SessionToken,
    idToken: idToken,
  });
}
