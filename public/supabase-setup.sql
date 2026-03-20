-- Niuarno Portfolio Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ilwauapmfmslvnnjjhrc/sql

-- Create tables

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  role TEXT DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  reply TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS "Project" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,
  image TEXT,
  link TEXT,
  github TEXT,
  color TEXT DEFAULT 'from-cyan-500 to-blue-500',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS "Service" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  features TEXT NOT NULL,
  color TEXT DEFAULT 'from-cyan-500 to-blue-500',
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS "Skill" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER DEFAULT 80,
  icon TEXT NOT NULL,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS "Experience" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Social Links table
CREATE TABLE IF NOT EXISTS "SocialLink" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert default data

-- Default Projects
INSERT INTO "Project" (title, description, category, tags, color, featured, "order") VALUES
('E-Commerce Fashion Store', 'A modern Shopify store for a fashion brand with custom product pages and seamless checkout experience.', 'Shopify', 'Shopify,E-commerce,Custom Theme', 'from-green-500 to-teal-500', true, 1),
('Corporate Business Website', 'Professional WordPress website for a consulting firm with custom post types and advanced SEO.', 'WordPress', 'WordPress,Business,SEO', 'from-blue-500 to-cyan-500', true, 2),
('Creative Portfolio', 'Stunning Wix website for a photographer showcasing their work with beautiful galleries.', 'Wix', 'Wix,Portfolio,Velo', 'from-purple-500 to-pink-500', true, 3),
('Online Learning Platform', 'WordPress membership site with WooCommerce subscriptions and course management.', 'WordPress', 'WordPress,WooCommerce,Membership', 'from-orange-500 to-red-500', false, 4),
('Restaurant Booking System', 'Wix website with custom booking system, menu display, and online ordering integration.', 'Wix', 'Wix,Booking,Custom', 'from-amber-500 to-orange-500', false, 5),
('Health & Wellness Store', 'Shopify store for health products with subscription management and loyalty program.', 'Shopify', 'Shopify,E-commerce,Subscription', 'from-emerald-500 to-green-500', false, 6);

-- Default Services
INSERT INTO "Service" (title, description, icon, features, color, "order") VALUES
('WordPress Development', 'Custom WordPress solutions tailored to your business needs, from simple blogs to complex e-commerce platforms.', 'Globe', 'Custom Theme Development,Plugin Development & Customization,WooCommerce Integration,Speed Optimization,Security Hardening,Maintenance & Support', 'from-cyan-500 to-blue-500', 1),
('Wix Website Design', 'Stunning Wix websites that combine beautiful design with powerful functionality for your business.', 'Palette', 'Custom Design Implementation,Velo JavaScript Development,Wix Stores Setup,Booking Systems,SEO Optimization,Mobile Responsiveness', 'from-purple-500 to-pink-500', 2),
('Shopify Stores', 'High-converting Shopify e-commerce stores designed to maximize sales and customer satisfaction.', 'Zap', 'Store Setup & Configuration,Custom Theme Development,App Integration,Payment Gateway Setup,Inventory Management,Conversion Optimization', 'from-green-500 to-teal-500', 3);

-- Default Skills
INSERT INTO "Skill" (name, level, icon, category, "order") VALUES
('WordPress', 95, 'Database', 'CMS', 1),
('Wix', 90, 'Globe', 'CMS', 2),
('Shopify', 88, 'Layers', 'CMS', 3),
('HTML/CSS', 95, 'Code', 'Frontend', 4),
('JavaScript', 85, 'Braces', 'Frontend', 5),
('React/Next.js', 80, 'Github', 'Frontend', 6);

-- Default Experience
INSERT INTO "Experience" (year, title, description, "order") VALUES
('2019', 'Started Web Development', 'Began my journey in web development, learning HTML, CSS, and JavaScript fundamentals.', 1),
('2020', 'WordPress Specialization', 'Focused on WordPress development, creating custom themes and plugins for clients.', 2),
('2021', 'CMS Expert', 'Expanded expertise to Wix and Shopify, becoming a versatile CMS developer.', 3),
('2022', 'Freelance Career', 'Launched full-time freelance career, serving clients from around the world.', 4),
('2023', 'Brand Launch', 'Established Niuarno as my professional brand for web development services.', 5),
('Present', 'Continued Growth', 'Building modern web solutions and helping businesses thrive online.', 6);

-- Default Social Links
INSERT INTO "SocialLink" (platform, url, icon, "order") VALUES
('GitHub', 'https://github.com/niuarno', 'Github', 1),
('LinkedIn', 'https://linkedin.com/in/niuarno', 'Linkedin', 2),
('Twitter', 'https://twitter.com/niuarno', 'Twitter', 3);

-- Default Site Settings
INSERT INTO "SiteSetting" (key, value, description) VALUES
('siteName', 'Niuarno', 'Website name'),
('siteDescription', 'Creative Web Developer specializing in WordPress, Wix, and Shopify solutions', 'Site description for SEO'),
('heroTitle', 'Creative Web Developer', 'Hero section title'),
('heroSubtitle', 'I craft beautiful, functional websites that help businesses grow online', 'Hero section subtitle'),
('aboutText', 'Hi, I''m Saheduzzaman Nour, the creative mind behind Niuarno. With years of experience in web development, I specialize in creating stunning websites using WordPress, Wix, and Shopify. My passion lies in transforming ideas into digital experiences that not only look great but also drive results.', 'About page text'),
('email', 'contact@niuarno.com', 'Contact email'),
('location', 'Dhaka, Bangladesh', 'Location');

-- Done! Your database is now set up.
