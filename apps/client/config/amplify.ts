const config = {
  Auth: {
    region: "us-east-1",
    userPoolId: process.env.AWS_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.AWS_COGNITO_WEB_CLIENT_ID,
  },
};

export default config;
