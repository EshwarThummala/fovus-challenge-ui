import { useState } from "react";
import { uploadFileToS3 } from "../api/aws_s3_api";
import { storeDetailsInDynamoDB } from "../api/aws_gateway_api";
import useSessionContext from "../context/SessionContext";
import { Button, Label, TextInput, FileInput, Alert } from "flowbite-react";

const HomeComponent = ({
  setConfirmationSuccess,
  setSignInSuccess,
  setSignUpSuccess,
}) => {
  const { tokens } = useSessionContext();
  const [inputMessage, setInputMessage] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [s3message, sets3Message] = useState("");
  const [dbMessage, setDbMessage] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event);
    const s3FilePath = await uploadFileToS3(inputFile, tokens);
    sets3Message(s3FilePath);
    const recordID = await storeDetailsInDynamoDB(
      { input_text: inputMessage, input_file_path: s3FilePath },
      tokens.idToken,
    );
    setDbMessage(recordID);
  }

  return (
    <>
      {s3message && (
        <Alert color="success" onDismiss={() => sets3Message("")}>
          <span className="font-medium">S3 Bucket Alert!</span> File{" "}
          {inputFile.name} successfully uploaded to S3 bucket (Path :{" "}
          <span className="font-medium">{s3message}</span>)
        </Alert>
      )}
      {dbMessage && (
        <Alert color="success" onDismiss={() => setDbMessage("")}>
          <span className="font-medium">Dynamo DB Alert!</span> Record
          succesfully created in Dynamo DB (record id :{" "}
          <span className="font-medium">{dbMessage}</span>)
        </Alert>
      )}
      <div className="flex h-screen items-center justify-center">
        <form className="w-full max-w-md rounded-lg bg-white px-4 py-8 shadow-md">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="inputMessage" value="Input Text" />
            </div>
            <TextInput
              id="inputMessage"
              type="text"
              value={inputMessage}
              placeholder="Enter text that appends to file content"
              required
              shadow
              onChange={(event) => {
                setInputMessage(event.target.value);
              }}
            />
          </div>
          <div id="">
            <div className="mb-2 mt-4 block">
              <Label htmlFor="file-upload" value="Upload file" />
            </div>
            <FileInput
              id="file-upload"
              onChange={(event) => setInputFile(event.target.files[0])}
            />
          </div>
          <div className="flex items-center justify-center">
            <Button
              outline
              gradientDuoTone="greenToBlue"
              type="submit"
              onClick={handleSubmit}
              className="mt-10 block"
            >
              Append Text
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <Button.Group outline>
              {
                <Button
                  color="gray"
                  onClick={() => {
                    setSignInSuccess(false);
                    setSignUpSuccess(true);
                    setConfirmationSuccess(true);
                  }}
                >
                  Logout
                </Button>
              }
            </Button.Group>
          </div>
        </form>
      </div>
    </>
  );
};

export default HomeComponent;
