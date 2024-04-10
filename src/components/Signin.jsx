import { useState } from "react";
import UserPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import useSessionContext from "../context/SessionContext";
import { getCognitoCredentials } from "../utils/getIndentityPoolCredentails";
import { Button, Label, TextInput } from "flowbite-react";

const Signin = ({ setSolPage, setSignInSuccess }) => {
  const { userName, setUsername } = useSessionContext();
  const [password, setPassword] = useState();
  const { setTokens } = useSessionContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = new CognitoUser({
      Username: userName,
      Pool: UserPool,
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password,
    });
    user.authenticateUser(authenticationDetails, {
      onSuccess: (data) => {
        getCognitoCredentials(data.idToken.jwtToken, setTokens);
        setSignInSuccess(true);
      },
      onFailure: (data) => {
        console.error("User not signed in, Authentication failed");
      },
      newPasswordRequired: (data) => {
        console.log("New user password required");
      },
    });
  };
  return (
    <>
      <div>
        <div className="mb-1 mt-4 block">
          <Label htmlFor="username" value="Your username" />
        </div>
        <TextInput
          id="username"
          type="text"
          value={userName}
          placeholder="Enter your username"
          required
          shadow
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      </div>
      <div>
        <div className="mb-2 mt-4 block">
          <Label htmlFor="password" value="password" />
        </div>
        <TextInput
          id="password"
          value={password}
          type="password"
          placeholder="Enter your password"
          required
          shadow
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>
      <div className="flex items-center justify-center">
        <Button
          outline
          gradientDuoTone="purpleToPink"
          type="submit"
          onClick={handleSubmit}
          className="mt-10 block"
        >
          Signin to your account
        </Button>
      </div>
    </>
  );
};

export default Signin;
