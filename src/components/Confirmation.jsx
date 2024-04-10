import { useState } from "react";
import UserPool from "./UserPool";
import aws from "aws-sdk";
import { Button, Label, TextInput } from "flowbite-react";

const Confirmation = ({ userName, setConfirmationSuccess }) => {
  aws.config.update({ region: "us-east-1" });

  const cognitoIdentityServiceProvider =
    new aws.CognitoIdentityServiceProvider();

  const [confirmationCode, setConfirmationCode] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    cognitoIdentityServiceProvider.confirmSignUp(
      {
        ClientId: UserPool.getClientId(),
        ConfirmationCode: confirmationCode,
        Username: userName,
      },
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          setConfirmationSuccess(true);
        }
      },
    );
  };
  return (
    <>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="confirmationNumber"
            value="Enter Confirmation Number"
          />
        </div>
        <TextInput
          id="confirmationNumber"
          type="number"
          value={confirmationCode}
          placeholder="Confirmation Number"
          required
          shadow
          onChange={(event) => {
            setConfirmationCode(event.target.value);
          }}
        />
      </div>
      <div className="flex items-center justify-center">
        <Button
          outline
          gradientDuoTone="cyanToBlue"
          type="submit"
          onClick={handleSubmit}
          className="mt-10 block"
        >
          Confirm Account
        </Button>
      </div>
    </>
  );
};

export default Confirmation;
