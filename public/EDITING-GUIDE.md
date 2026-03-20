# 🎨 Niuarno Portfolio - Quick Editing Guide

## 📍 File Locations

| What You Want to Change | File Path |
|------------------------|-----------|
| **Name, SEO, Meta Tags** | `src/app/layout.tsx` |
| **Home Page** | `src/app/page.tsx` |
| **About Page** | `src/app/about/page.tsx` |
| **Services Page** | `src/app/services/page.tsx` |
| **Portfolio Page** | `src/app/portfolio/page.tsx` |
| **Contact Page** | `src/app/contact/page.tsx` |
| **Navigation Menu** | `src/components/Navigation.tsx` |
| **Footer** | `src/components/Footer.tsx` |
| **Colors & Theme** | `src/app/globals.css` |

---

## 📬 View Contact Messages

### Admin Panel Access
1. Go to: `your-website.com/admin`
2. Enter admin token: `niuarno-admin-2024`
3. View all messages from clients

### Features
- ✅ View all submitted messages
- ✅ Mark as Read / Replied
- ✅ Reply via email (opens your email client)
- ✅ Delete messages

### Change Admin Token
For security, change the default token before deploying:

1. Open `src/app/api/contact/route.ts`
2. Change: `niuarno-admin-2024` to your custom password
3. Also update in `src/app/admin/page.tsx` (line 40)

---

## 🎯 Common Edits

### Change Your Name
Files to edit: `layout.tsx`, `page.tsx`, `about/page.tsx`, `Footer.tsx`

### Change Brand Name "Niuarno"
Files to edit: `Navigation.tsx`, `Footer.tsx`, `layout.tsx`

### Change Colors
File: `src/app/globals.css`
```css
--primary: oklch(0.75 0.15 195);  /* Cyan - main color */
--accent: oklch(0.55 0.2 300);    /* Purple - secondary */
```

### Add Portfolio Project
File: `src/app/portfolio/page.tsx`
Add to the `projects` array:
```typescript
{
  id: 9,
  title: "Your Project Name",
  description: "Project description here",
  category: "WordPress", // or Wix, Shopify, Custom
  image: "/projects/your-image.jpg",
  tags: ["WordPress", "E-commerce"],
  link: "https://your-project.com",
  github: "https://github.com/...",
  color: "from-blue-500 to-cyan-500",
},
```

### Change Social Links
Files: `src/app/contact/page.tsx`, `src/components/Footer.tsx`

### Change Contact Info
File: `src/app/contact/page.tsx`
Edit the `contactInfo` array

---

## 🚀 After Making Changes

1. **Save the file**
2. **Open GitHub Desktop**
3. **Write a commit message** (e.g., "Updated contact info")
4. **Click "Commit to main"**
5. **Click "Push origin"**
6. **Done!** Vercel auto-deploys in ~30 seconds

---

## 🎨 Color Options

Replace the gradient `color` values in your code:

| Gradient Class | Colors |
|---------------|--------|
| `from-cyan-500 to-blue-500` | Cyan to Blue |
| `from-purple-500 to-pink-500` | Purple to Pink |
| `from-green-500 to-teal-500` | Green to Teal |
| `from-orange-500 to-red-500` | Orange to Red |
| `from-amber-500 to-yellow-500` | Amber to Yellow |
| `from-violet-500 to-purple-500` | Violet to Purple |

---

## 📸 Adding Images

1. Put images in: `public/` folder
2. Reference in code: `/your-image.jpg`

Example:
```
public/
  ├── projects/
  │   ├── project1.jpg
  │   └── project2.jpg
  └── profile.jpg
```

Use in code: `image: "/projects/project1.jpg"`

---

## 🔗 Useful Links

- **Vercel Dashboard**: vercel.com/dashboard
- **GitHub Desktop**: desktop.github.com
- **Tailwind Colors**: tailwindcss.com/docs/customizing-colors

---

Made with ❤️ by Niuarno
