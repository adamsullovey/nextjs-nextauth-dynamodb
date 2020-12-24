import React from "react";
import { GetServerSideProps } from "next";

import { signIn, signOut, useSession, getSession } from "next-auth/client";

const Home = ({ session: serverSession }) => {

  
  // I think using this hook always results in a request to get session info initiated in the browser
  // https://next-auth.js.org/getting-started/client#usesession
  // if session info was populated in `getServerSideProps`, this will have data available immediately, and the next request updates it
  const [clientOrServerSession, loading] = useSession();

  // I don't know what I want, let's try both possibilities for getting session info
  const session = clientOrServerSession?.user ? clientOrServerSession : serverSession

  return (
    <>
      <h1>Let's try authentication with NextJS, NextAuth.JS, and Twitter</h1>

      {(!session) && (
        <>
          You are not signed in <br />
          {/* <button onClick={signIn}>Sign in</button> */}
          <button onClick={() => signIn("twitter")}>
            Sign in with Twitter
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name}<br />
          <img src={session.user.image} /><br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}

      <h2>What does the server know about the session?</h2>
      <pre>{JSON.stringify({ serverSession }, null, 2)}</pre>

      <h2>What does the browser know about the session?</h2>
      <pre>{JSON.stringify({  clientOrServerSession, loading }, null, 2)}</pre>


    </>
  );
};

/**
 * This pulls session info out of the request, and puts it in props for the page the server is about to render
 * in _app.tsx, NextAuth's Provider will use the session prop and have authentication info available when rendering on the server.
 * 
 * If this function is disabled, the request for authentication info from Twitter
 * is initiated in the browser (but goes through the nextjs backend)
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return { props: { session } };
};

export default Home;
