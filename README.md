## What is this?

I want to try authenticating a user in NextJS with [NextAuth.js](https://next-auth.js.org/) and storing account info in [DynamoDB](https://aws.amazon.com/dynamodb/) via [next-auth-dynamodb](https://github.com/tgandrews/next-auth-dynamodb)



## How do I run it?

1. Install stuff with yarn (npm will probably work too)

  ```sh
  yarn
  ```

2. Set up a [Twitter app](https://developer.twitter.com/en/apps) for yourself. I don't know all the steps, but I know this app will need the **Callback URL** set to your local server's URL (eg http://localhost:3000/api/auth/callback/twitter), and you will to copy your **Consumer API key** and **secet API key** into the app's configuration. Read-only permissions (not read and write) is enough.

3. Set up 3 DynamoDB tables needed by nextauth-dynamodb:

   * `sessions`
   * `users`
   * `accounts`
  
   The required indexes are in the [Omanyd schemas in the source code](https://github.com/tgandrews/next-auth-dynamodb/blob/main/src/index.ts#L17)
  
   Creating a new AWS user that only work with those 3 tables is a great idea too.

3. Copy `.env.example` to a new file called `.env` and fill in the environment variables with your credentials from AWS and Twitter, and other values.

4. Run it locally with the command

  ```sh
  yarn dev
  ```
5. When it is running, http://localhost:3000/ should show a simple webpage with a button to sign-in with Twitter

## How do I deploy it to Netlify?

1. Set up a Netlify app with the same environment variables that are in your `.env`, but with values set to run at your Netlify app's URL. Twitter's Callback URL option accepts multiple URLs, remember to add a new URL for your netlify app (eg https://random-words-6232dc.netlify.app/api/auth/callback/twitter). Link this the folder on your computer to your Netlify site with the Netlify CLI with `yarn netlify link`


2. Confirm you can build the site locally with Netlify's CLI tool

  ```sh
  yarn netlify build
  ```


3. If you can build, try deploying:

  ```sh
  yarn netlify deploy
  ```

Netlify has areas to check the logs during deploy and the Netlify Lamda used by NextAuth.js for errors.

## What did I learn?

- common AWS environment variables like [`AWS_ACCESS_KEY_ID` are reserved variable names in Netlify](https://community.netlify.com/t/aws-access-key-id-is-a-reserved-environment-variable/18835), so you need to get your AWS credentials into your Lamda function with different names.

  - luckily this project depends on the DynamoDB wrapper [Omanyd](https://github.com/tgandrews/omanyd#getting-started) which can use variables named `OMANYD_AWS_ACCESS_KEY_ID` for accessing DynamoDB, which eliminates the conflict
  - [Remy Sharp demonstrates another work-around here](https://remysharp.com/2019/05/18/aws-inside-netlify)

- [Next Auth with DynamoDB](https://github.com/tgandrews/next-auth-dynamodb) doesn't have docs, but the code is easy enough to read

  - this requires 3 DynamoDB tables (accounts, sessions, users). My other recent DynamoDB work as all been done in a single table, so this was a small surprise but totally ok

- plan on having a build script like build.sh for Netlify-hosted projects from the start. I feel like I always add one eventually

- Twitter requires some sort of approval for creating new applications, but old applications are grandfathered in and can be pointed at new URLs
