# VOID SMP Store

Storefront (`public/`) plus a dependency-free Node.js backend (`api/`, `lib/`) that runs as a Vercel serverless function.

## What it does
**Store:** separate sections for Ranks, Coins, Crate Keys, Server Rules (10, editable) and DC & IP, a floating logo dock (hover for the IP and Discord), search and sort, cart, animated checkout.

**Orders (saved on the server):** every checkout stores the order ID, date and time, Minecraft name and edition, Discord name, items, total, status, the customer's payment **screenshot**, an optional eSewa transaction ID, the IP and device that placed it, a status timeline, and a private staff note. Prices are set by the server, so they can't be edited in a browser.

**Admin Area (`/admin`):** opens only with your password. You see every order with who, when, what, proof of payment, and can mark Pending / Paid / Delivered / Cancelled, add notes, search, and export CSV. Orders are never deleted.

Payments are still verified by a person: customers pay by eSewa QR, upload a screenshot, and staff check it. Nothing is auto-verified.

## Run on your computer (Windows)
Install Node.js LTS from nodejs.org, then double-click **start.bat**. (Or run `npm start` and open http://localhost:3000.)
Open `/admin` and create your admin password the first time. Local data is saved in `data/`.

## Deploy to Vercel
1. Push this folder to GitHub, import it at vercel.com/new (framework: Other, no build command).
2. **Database (required, free):** Vercel project > Storage > Marketplace > **Upstash Redis** > create > connect. This saves orders AND screenshots permanently.
3. Open `https://your-site.vercel.app/admin` right after deploying and **create your password immediately** (the first person to do this owns the Admin Area). Or set `ADMIN_PASSWORD` in Settings > Environment Variables to fix it in advance; you can change a self-set password inside the Admin Area any time.
4. Optional: `DISCORD_WEBHOOK_URL` gives a Discord message for every new order.
Redeploy after adding variables.

Without the database step, Vercel keeps orders only in temporary memory; the admin page warns you, and creating a password in the Admin Area is blocked until a database is connected (or `ADMIN_PASSWORD` is set).

## Editing
- Prices and products: `lib/products.js`
- Server rules: `RULES` at the top of the `<script>` in `public/index.html`
- Server IP and Discord invite: the same script, plus the links in the page
- Images: `public/assets/` (your untouched originals are in `source-images/`). Product images are shown 4:5, so crop new ones to that shape. The eSewa QR goes in `public/assets/payment-qr.png`.

## Privacy note
The backend stores customers' IP address, device, Discord name and payment screenshot so you can verify and keep records. Only people with the admin password can view them. Tell your players, and delete old records from your Upstash dashboard when you no longer need them.

## Tests
`npm test` runs the API tests (prices, validation, uploads, admin login, password rules).
