import { useState } from "react";
import {
  getFileFromS3,
  uploadFileToS3,
  checkFilePresentInS3,
} from "../api/aws_s3_api";
import { storeDetailsInDynamoDB } from "../api/aws_gateway_api";
import useSessionContext from "../context/SessionContext";
import {
  Button,
  Label,
  TextInput,
  FileInput,
  Alert,
  Spinner,
} from "flowbite-react";

const HomeComponent = ({
  setConfirmationSuccess,
  setSignInSuccess,
  setSignUpSuccess,
}) => {
  const { tokens, userName } = useSessionContext();
  const [inputMessage, setInputMessage] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [s3message, sets3Message] = useState("");
  const [dbMessage, setDbMessage] = useState("");
  const [outputFileData, setOutputFileData] = useState("");
  const [ouputFileFound, setOutputFileFound] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  async function handleSubmit(event) {
    setSubmitClicked(true);
    if (!inputFile || !inputMessage) {
      console.log("input file or message should not be empty");
      setSubmitClicked(false);
      return false;
    }
    event.preventDefault();
    const s3FilePath = await uploadFileToS3(inputFile, tokens);
    sets3Message(s3FilePath);
    const recordID = await storeDetailsInDynamoDB(
      { input_text: inputMessage, input_file_path: s3FilePath },
      tokens.idToken,
    );
    setDbMessage(recordID);
    let isPresent = false;
    const outputFileName = "output" + inputFile.name;
    const intervalId = setInterval(async function () {
      isPresent = await checkFilePresentInS3(outputFileName, tokens);
      if (isPresent) {
        setOutputFileFound(true);
        setOutputFileData(await getFileFromS3(outputFileName, tokens));
        setSubmitClicked(false);
        clearInterval(intervalId);
      } else {
        console.log("Object Not yet Found");
      }
    }, 5000);
  }

  return (
    <>
      {s3message && (
        <div className="flex justify-center">
          <Alert
            className="mt-3 max-w-xl px-2 py-1 text-sm"
            color="info"
            onDismiss={() => sets3Message("")}
          >
            <span className="font-medium">S3 Bucket Alert!</span> File{" "}
            {inputFile.name} uploaded to S3 bucket (Path :{" "}
            <span className="font-medium">{s3message}</span>)
          </Alert>
        </div>
      )}
      {dbMessage && (
        <div className="flex justify-center">
          <Alert
            className="mt-3 max-w-xl px-2 py-1 text-sm"
            color="info"
            onDismiss={() => setDbMessage("")}
          >
            <span className="font-medium">Dynamo DB Alert!</span> Record created
            in Dynamo DB (record id :{" "}
            <span className="font-medium">{dbMessage}</span>)
          </Alert>
        </div>
      )}
      {ouputFileFound && (
        <div className="flex justify-center">
          <Alert
            className="mt-3 max-w-xl px-2 py-1 text-sm"
            color="success"
            onDismiss={() => setOutputFileFound(false)}
          >
            <span className="font-medium">Output Alert!</span> Output File
            successfully Generated
          </Alert>
        </div>
      )}
      {outputFileData && (
        <div className="flex justify-center">
          <Alert
            className="mt-3 max-w-xl px-2 py-1 text-sm"
            color="success"
            onDismiss={() => {
              setOutputFileData("");
              setSubmitClicked(false);
            }}
          >
            <span className="font-medium">Outfile Content</span>{" "}
            {outputFileData}
          </Alert>
        </div>
      )}
      {submitClicked && (
        <div className="flex justify-center">
          <Spinner aria-label="Default status example" />
        </div>
      )}
      <div className="flex h-screen items-center justify-center">
        <form className="w-full max-w-md rounded-lg bg-white px-4 py-8 shadow-md">
          <div>
            <div className="mb-1 flex justify-center">
              <h3>
                <b>{`Hi ${userName}`}</b>
              </h3>
            </div>
          </div>
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
              <Label
                htmlFor="file-upload"
                value="Upload file (Ensure each file uploaded to S3 has a unique filename since files are not deleted from S3. Otherwise, when fetching output, it may retrieve a previously generated uploaded output file.)"
              />
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
