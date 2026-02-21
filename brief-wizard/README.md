# Brief Wizard 🧙

Multi-language client brief form (RU / EN / UA) with Notion CRM integration.

## Stack
- **React 18** + **Vite**
- **Vercel** serverless API
- **Notion API** for saving briefs

---

## Local development

```bash
npm install

# Create .env.local with your keys:
cp .env.example .env.local
# Fill in NOTION_TOKEN and NOTION_DATABASE_ID

npm run dev
```

> Note: the `/api/submit-brief` endpoint only works in Vercel (local or deployed).
> For local testing install Vercel CLI: `npm i -g vercel` and run `vercel dev`

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/brief-wizard.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: **Vite**
4. Click **Deploy**

### 3. Add Environment Variables
In Vercel project → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `NOTION_TOKEN` | `secret_...` (from notion.so/my-integrations) |
| `NOTION_DATABASE_ID` | Your database ID (from Notion URL) |

Redeploy after adding variables.

---

## Notion Setup

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration**
2. Give it a name, copy the **Internal Integration Token**
3. Open your CRM database in Notion → `...` → **Connections** → add your integration
4. Copy the database ID from the URL (the long string before `?v=`)

### Customizing Notion properties
Edit `api/submit-brief.js` — the `properties` section has examples commented out.
Uncomment and adjust to match your actual Notion database columns (Status, Email, etc).

---

## How it works

```
User fills form → clicks Submit
  → POST /api/submit-brief (Vercel serverless)
    → Notion API creates a new page in your CRM database
      → Page contains all brief fields, organized by sections
```
