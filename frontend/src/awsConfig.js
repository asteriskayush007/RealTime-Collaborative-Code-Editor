import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "ap-south-1",
      userPoolId: "ap-south-1_iyC07ecLm",
      userPoolClientId: "4dr7pu594osl5n3bsdm6q74u6d",
      loginWith: {
        email: true,
      },
    },
  },
});

