import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_MSr8YU7RL",
  ClientId: "4m57ecpneffjj48l9crsp39m2c",
};

export default new CognitoUserPool(poolData);
