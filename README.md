## What is this?

I want to try authenticating a user in NextJS with [NextAuth.js](https://next-auth.js.org/) and storing account info in [DynamoDB](https://aws.amazon.com/dynamodb/) via [next-auth-dynamodb](https://github.com/tgandrews/next-auth-dynamodb)

## How do I run it?

1. Install stuff with yarn (npm will probably work too)

```sh
yarn
```

2. Set up a [Twitter app](https://developer.twitter.com/en/apps) for yourself. I don't know all the steps, but I know this app will need the **Callback URL** set to your local server's URL (eg http://localhost:3000/), and Consumer API key and secet API key. Read-only permissions (not read and write) is enough.

3. Copy `.env.example` to a new file called `.env` and fill in the environment variables with your credentials from AWS and Twitter, and other values

4. Run it locally. Make sure your Twitter app is set up with a callback URL pointed at your dev server

```sh
yarn dev
```

## How do I deploy it?

1. Confirm you can build it locally with Netlify's CLI tool

```sh
yarn netlify build
```

2. Set up a Netlify app with the same environment variables that are in your `.env`, but with values set to run at your Netlify app's URL. You can safe some work by setting up a second Twitter app with different credentials for this.

3. Assuming you have linked your folder to Netlify deploy with:

```sh
yarn netlify deploy
```

Netlify has areas to check the logs during deploy and the Netlify Lamda used by NextAuth.js for errors.

## What did I learn?

- common AWS environment variables like [`AWS_ACCESS_KEY_ID` are reserved variable names](https://community.netlify.com/t/aws-access-key-id-is-a-reserved-environment-variable/18835) in Netlify, so you need to get your AWS credentials into your Lamda function a different way than entering them in the Netlify GUI.

  - luckily this project depends on the DynamoDB wrapper [Omanyd](https://github.com/tgandrews/omanyd#getting-started) which can use variables named `OMANYD_AWS_ACCESS_KEY_ID` for accessing DynamoDB eliminates the conflict
  - [Remy Sharp demonstrates another work-around here](https://remysharp.com/2019/05/18/aws-inside-netlify) which I am using as well (because why not try everything in an experiment link this)

- [Next Auth with DynamoDB](https://github.com/tgandrews/next-auth-dynamodb) doesn't have docs, but the code is easy enough to read

  - this requires 3 DynamoDB tables (accounts, sessions, users). My other DynamoDB work as all been done in a single table, so this was a small surprise but totally ok

- plan on having a build script like build.sh from the start. I feel like I always add one eventually with Netlify projects

- Twitter requires some sort of approval for creating new applications, but old applications are grandfathered in and can be pointed at new URLs
