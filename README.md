# **Events Platform Frontend**

## Summary

This is the frontend for the Events Platform application, built using React. It provides a user-friendly interface for browsing, creating, and managing events.

## <a name="tech-stack">⚙️ Tech Stack:</a>

- TypeScript.js
- React.js
- Tailwind
- Stripe

## Installation & Setup

Follow these steps to set up the project locally on your machine.

**Cloning the Repository**

```bash
git clone https://github.com/Sakhee89/fe-events-platform
cd fe-events-platform
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a .env file in the root directory and add the following variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY, REACT_APP_STRIPE_API_KEY, REACT_APP_BACKEND_URL

Setup a supabase account (https://supabase.com/), google developer account (https://console.cloud.google.com/) and stripe account (https://dashboard.stripe.com/).

Once the supabase account is set up, create a new project with a project name. Then click on create new project. On the dashboard, click on Authentication on your left, then go to providers, and scroll down to google. Now go to console.cloud.google.com to register and create a new project. Select the created project, and in the search, search calendar api to enable it. Once done, click the OAuth consent screen to the left, select external user type, and then click create. Go down to the authorized domain, and to obtain this, go to the supabase site where there is an redirect URL you can copy and paste into the authorized domain, only add the top level domain. Next, add your email in developer contact information, then press add and continue. Add or remove scopes after, select the email and profile api, then go to the google calendar api and also add this scope, then click update. You should now see the add test users on the test users screen, add your own email, Save and continue. Now go to credentials and create credentials at the top of your screen. Select the create OAuth Client ID, go to Authorised JavaScript Origins and add the authorised origin for example http://localhost:3000 if you are running on local host or the hosted domain. For the Authorized redirect URLs copy the redirect URL from Supabase and paste it in here.

Copy both your client ID and client secret and paste it in Supabase client ID and client secret press the Google enabled and save.
On your home page scroll down and you should be able to find your Project URL and API Key. Copy this and add your REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your env with these values.

Next, on your stripe account once it's set up go to your dashboard, click Developers, then API keys. Copy the publishable key and add this to your REACT_APP_STRIPE_API_KEY env variable. Please note that your publishable key and secret key are in test mode until you are signed up with your business details.

**Running the Project**

To start the server, use the following command:

```bash
npm start
```

## Versions

This project is currently supported with Node v20.10.0 and React v18.3.1
