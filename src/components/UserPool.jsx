import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_zJNo48cHH",
    ClientId: "43nc6lgkrqfe9s5lhab6uuvcs",
};

export default new CognitoUserPool(poolData)