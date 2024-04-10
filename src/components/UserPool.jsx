import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_fMBfhJzmP",
  ClientId: "774qeedghagljh9taharjg8g5g",
};

export default new CognitoUserPool(poolData);
