import { useState } from "react";
import UserPool from "./UserPool";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = ({ userName, setUsername, setSignUpSuccess }) => {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    UserPool.signUp(
      userName,
      password,
      [{ Name: "email", Value: email }],
      null,
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          setSignUpSuccess(true);
        }
      },
    );
  };
  return (
    <>
      <div>
        <div className="mb-1 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput
          id="email"
          type="email"
          value={email}
          placeholder="name@mail.com"
          required
          shadow
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </div>
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
          gradientDuoTone="greenToBlue"
          type="submit"
          onClick={handleSubmit}
          className="mt-10 block"
        >
          Register New Account
        </Button>
      </div>
    </>
  );
};

export default SignUp;
