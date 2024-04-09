import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { SessionContextProvider } from "./context/SessionContext";
import { useState } from "react";
import HomeComponent from "./components/HomeComponent";
import Confirmation from "./components/Confirmation";
import { Button, Label, TextInput, FileInput } from "flowbite-react";

function App() {
  const [userName, setUsername] = useState();
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  return (
    <div>
      <SessionContextProvider>
        {!signInSuccess ? (
          <div className="flex h-screen items-center justify-center">
            <form className="w-full max-w-md rounded-lg bg-white px-4 py-8 shadow-md">
              {!signUpSuccess ? (
                <Signup
                  setUsername={setUsername}
                  userName={userName}
                  setSignUpSuccess={setSignUpSuccess}
                />
              ) : !confirmationSuccess ? (
                <Confirmation
                  userName={userName}
                  setConfirmationSuccess={setConfirmationSuccess}
                />
              ) : (
                !signInSuccess && <Signin setSignInSuccess={setSignInSuccess} />
              )}
              <div className="mt-10 flex items-center justify-center">
                <Button.Group outline>
                  {signUpSuccess && (
                    <Button
                      color="gray"
                      onClick={() => {
                        setSignInSuccess(false);
                        setSignUpSuccess(false);
                        setConfirmationSuccess(false);
                      }}
                    >
                      Signup
                    </Button>
                  )}
                  {(!signUpSuccess || !confirmationSuccess) && (
                    <Button
                      color="gray"
                      onClick={() => {
                        setSignInSuccess(false);
                        setSignUpSuccess(true);
                        setConfirmationSuccess(true);
                      }}
                    >
                      Signin
                    </Button>
                  )}
                </Button.Group>
              </div>
            </form>
          </div>
        ) : (
          <HomeComponent
            setSignInSuccess={setSignInSuccess}
            setSignUpSuccess={setSignUpSuccess}
            setConfirmationSuccess={setConfirmationSuccess}
          />
        )}
      </SessionContextProvider>
    </div>
  );
}

export default App;
