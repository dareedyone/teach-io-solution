# Teach IO Fullstack Trial Solution

## What was done

A payment tracking app that **stores** payments to a given Stripe account with the ability to **refund** a payment from the app with the following criteria

- A list of payments is displayed with Stripe customer ID, Payment amount, currency and Date of payment.
- Ability to refund each payments.
- Incoming payments is stored in the database via webhook.

Use the following tech stack:

- Node.js (Express)
- MongoDB (using Mongoose)
- React (using functional components and hooks)

## What could be improved

- The refund could be extended on client to take any refund amount, this was handled on the server. 'Reason' can also also be added if desired.
- If real time tracking is desired, socket would need to be plugged on the webhook api and consumed or listened to on client.
- The file structure was pretty basic it should extended for a proper project. Proper methodology and practices like TDD (e.g unit and integration) and input validation (e.g with library) could be employed.

## Other approach to solution

- If there's no data transformation there might not be a need to save in DB or use webhook if real-time capturing is not needed. List api from stripe could be used.

## Setting up dev for testing

- Navigate to server and add a .env based env.example with own variables
- Run npm install on server root folder and npm run start:dev
- Install stripe-cli then in a separate terminal run `stripe listen --forward-to localhost:4000/webhook`
- In another terminal simulate a charge succeed using stripe cli command `stripe trigger charge.succeeded`
- In another terminal, navigate to client folder root and run npm start.
