# ZeroAbstraction

A personal universe / portfolio project built with Next.js 15, Payload CMS 3.x, and PostgreSQL.

## Prerequisites

- Node.js (v18.20.2+ or v20.9.0+)
- PostgreSQL database
- npm, yarn, or pnpm

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zeroabstraction.git
   cd zeroabstraction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy the example environment file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual development secrets (e.g. your local PostgreSQL `DATABASE_URL` and a random `PAYLOAD_SECRET`).
   - **Important:** Do not commit `.env` to version control. It contains sensitive credentials.

4. **Run the Development Server**
   Start the Next.js development server (which also powers the Payload CMS):
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Payload Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Database Migrations

This project uses Payload's version-controlled database migrations (auto-sync is disabled).

Whenever you modify any Collections or Globals in `src/collections/` or `src/globals/`, you must generate and apply a migration:

1. **Generate a migration file**
   ```bash
   npm run payload:migrate:create -- --file my_new_feature
   ```
   This will create a new migration script in `src/migrations/`.

2. **Apply migrations**
   ```bash
   npm run payload:migrate
   ```
   Run this locally to apply the changes to your local database, and ensure it runs during your deployment process for production.

## Deployment

This project uses a standard Docker + Docker Compose architecture and is optimized for deployment via Coolify or similar self-hosted platforms. 
For deployment testing and validation, refer to `deploy-validation/DEPLOYMENT_VALIDATION.md`.
