# Fovus Challenge UI

This is a simple full-stack web application developed with AWS, React, and Flowbite Tailwind CSS. It demonstrates my understanding of numerous AWS services, including EC2, Lambda, API Gateway, Cognito, DynanoDB, IAM, and a few others. Additionally, it demonstrates my proficiency in the React Library. The project's functionality is simple: take some input data and a text file, then append the input text content to the input file. This needs to be done using various AWS services.

# Cloning and Setting Up a React Project Locally

Follow these instructions to clone a React project created with Create React App from GitHub and set it up on your local machine.

## Prerequisites

- Node.js and npm installed on your machine. You can download and install them from [here](https://nodejs.org/).
- Make sure you install the latest stable version.
- verify your installation with the following commands.
  ```bash
  node -v
  npm -v
  ```

## Steps

- Open up a command line interface in your local path where you want to clone the repository

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/EshwarThummala/fovus-challenge-ui.git
   ```

2. **Opening the Repository Folder**

   ```bash
   cd fovus-challenge-ui
   ```

3. **Installing all the dependencies needed to run the project**

   ```bash
   npm install
   ```

4. **Running the application**

   ```bash
   npm start
   ```

5. **Opening the localhost:3000**

- The browser should automatically open after the above command, if not, copy and paste the following url in the broswer.
  ```bash
  http://localhost:3000
  ```

6. **Logging into the Application**

- After the application is opened, you will see a SignUp page, Create your profile there.
- Give a valid email address and the password should be 8 characters long and username should be unique.
- After clicking on the register account you will get a confirmation code to your email.
- Enter the code into the website and click on confirm account.
- Then it asks you to signin into the account.
- Signin into the account using the username and password created in the signup page.
- Once you signed in, you will see the home page.
