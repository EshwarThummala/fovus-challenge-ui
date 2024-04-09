import aws from "aws-sdk";
import { CognitoIdentityServiceProvider, CognitoIdentity } from "aws-sdk";

const region = "us-east-1";
aws.config.update({region: region})
const cognitoIdentity = new CognitoIdentity();

export async function getCognitoCredentials(idToken, setTokens) {
  console.log(idToken)
  const params = {
    IdentityPoolId: "us-east-1:e5439179-7d1a-4799-9b3a-e6207cf6f365",
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_zJNo48cHH": idToken,
    },
  };
  const cognitoIdentityId = await cognitoIdentity.getId(params).promise();
  const paramsForCredentials = {
    IdentityId: cognitoIdentityId.IdentityId,
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_zJNo48cHH": idToken,
    },
  };
  const credentialsResponse = await cognitoIdentity
    .getCredentialsForIdentity(paramsForCredentials)
    .promise();
  const { AccessKeyId, SecretKey, SessionToken } = credentialsResponse.Credentials
  setTokens({
    accessKeyId: AccessKeyId,
    secretAccessKey: SecretKey,
    sessionToken: SessionToken,
    idToken: idToken
  })
}
