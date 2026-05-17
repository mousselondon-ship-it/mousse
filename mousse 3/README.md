# Mousse — Deployment Guide

## Project structure

```
mousse/
├── public/
│   └── index.html        The website
├── api/
│   └── reserve.js        Serverless function — handles reservations, sends emails
├── vercel.json           Vercel routing config
├── package.json          Dependencies
└── .env.example          Environment variables template
```

---

## Step 1 — Set up your Google app password

Mousse uses your existing Google Workspace account (hello@moussewine.co.uk) to send emails — no extra service needed.

1. Make sure **2-Step Verification** is enabled on your Google account
   - Go to **myaccount.google.com → Security → 2-Step Verification**
2. Generate an app password:
   - Go to **myaccount.google.com → Security → 2-Step Verification → App passwords**
   - App: **Mail**, Device: **Other** (type "Vercel")
   - Click **Generate** — copy the 16-character password (e.g. `abcd efgh ijkl mnop`)
   - You only see this once, so copy it now
3. That's it — no new account, no third-party service

---

## Step 2 — Deploy to Vercel

1. Go to **vercel.com** and create a free account
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. In your terminal, navigate to this folder and run:
   ```
   vercel
   ```
4. Follow the prompts — choose "No" to existing project, name it `mousse`
5. When asked about the build settings, just press Enter to accept defaults

---

## Step 3 — Add your environment variable

1. In the Vercel dashboard, go to your project → **Settings → Environment Variables**
2. Add two variables:
   - **Name:** `GOOGLE_EMAIL` **Value:** `hello@moussewine.co.uk`
   - **Name:** `GOOGLE_APP_PASSWORD` **Value:** your 16-character app password (no spaces)
3. Click Save, then redeploy:
   ```
   vercel --prod
   ```

---

## Step 4 — Connect your domain

1. In Vercel dashboard → **Settings → Domains**
2. Add `moussewine.co.uk`
3. Vercel will show you DNS records to add
4. Add them in Cloudflare or Namecheap — propagation takes 5–30 minutes

---

## Step 5 — Test it

1. Go to your site and make a test reservation
2. Check hello@moussewine.co.uk for the notification email
3. Check the Vercel dashboard → **Functions** tab to see the API call logs

---

## What happens when someone reserves

1. Customer fills in the form and clicks Confirm
2. Browser sends a POST request to `/api/reserve`
3. The function validates the data and calls Resend
4. **You** get an email at hello@moussewine.co.uk with all the details
5. **Customer** gets a confirmation email if they provided an email address
6. Customer sees the confirmation screen on the site

---

## Next steps (Square integration)

When you've enabled inventory tracking in Square:

1. Create a Square Developer account at **developer.squareup.com**
2. Generate a production API key
3. Add `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID` to Vercel environment variables
4. We'll add two more API functions:
   - `api/catalogue.js` — fetches your live drink list from Square
   - `api/order.js` — creates Square orders for Buy & Collect payments

---

## Local development

```bash
npm install
cp .env.example .env.local
# Add your RESEND_API_KEY to .env.local
vercel dev
```

This runs the site and API functions locally at http://localhost:3000
