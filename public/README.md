# Niuarno Portfolio Website

A modern, animated portfolio website for Saheduzzaman Nour (brand: Niuarno), a web developer specializing in WordPress, Wix, and Shopify.

## Features

- 🎨 Modern, futuristic dark theme with cyan/purple accents
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔐 Admin panel for content management
- 📧 Contact form with message management
- 🖼️ Image upload for projects
- 🌐 Multi-page architecture with animations

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Animations**: Framer Motion

## Deployment on Vercel

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)

### Step 2: Set Up Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DIRECT_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
ADMIN_TOKEN=your-secure-admin-token-here
```

### Step 3: Deploy

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy

### Step 4: Seed the Database

After deployment, seed the database with initial data:

1. Go to your deployed site's admin panel: `https://your-site.vercel.app/admin`
2. Login with your ADMIN_TOKEN
3. The database will be seeded automatically, or you can manually call:
   ```
   POST https://your-site.vercel.app/api/seed
   Authorization: Bearer your-admin-token
   ```

## Local Development

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Seed initial data
curl -X POST http://localhost:3000/api/seed -H "Authorization: Bearer niuarno-admin-2024"

# Start development server
bun run dev
```

## Admin Panel

Access the admin panel at `/admin` with your ADMIN_TOKEN.

Features:
- **Dashboard**: Overview of projects, messages, and stats
- **Projects**: Add, edit, delete portfolio projects with image upload
- **Messages**: View and reply to contact form submissions
- **Services**: Manage your service offerings
- **Skills**: Update your skill levels
- **Experience**: Edit your timeline/experience
- **Settings**: Update site information, contact details, and social links

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── contact/   # Contact form submissions
│   │   ├── projects/  # Projects CRUD
│   │   ├── services/  # Services CRUD
│   │   ├── settings/  # Site settings
│   │   ├── skills/    # Skills CRUD
│   │   └── ...
│   ├── about/         # About page
│   ├── contact/       # Contact page
│   ├── portfolio/     # Portfolio page
│   ├── services/      # Services page
│   └── admin/         # Admin panel
├── components/
│   ├── ui/            # shadcn/ui components
│   └── animations/    # Animation components
└── lib/
    └── db.ts          # Prisma client
```

## License

MIT License
