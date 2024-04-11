# Fovus CDK App

## Prerequisites

Before running this CDK app locally, make sure you have the following prerequisites installed:

- Node.js and npm (or yarn)
- AWS CLI configured with appropriate IAM permissions

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/EshwarThummala/fovus-challenge-ui.git
    ```

2. Navigate to the root directory of the cloned repository:

    ```bash
    cd focus-challenge-ui/fovus-cdk
    ```

3. Install project dependencies:

    ```bash
    npm install
    ```

## Running Locally

To run this CDK app locally, follow these steps:

1. Ensure your AWS credentials are properly configured on your local machine.

2. Run the following command to synthesize the CloudFormation template for the CDK stack:

    ```bash
    cdk synth
    ```

3. Inspect the generated CloudFormation template (`cdk.out` directory) to verify that it matches your expectations.

4. (Optional) Test Lambda functions or other resources locally using AWS SAM CLI or other appropriate tools.

## Deploying to AWS

To deploy this CDK app to AWS, run the following command:

```bash
cdk deploy


- To destroy whole infrastructure use below command
cdk destroy

