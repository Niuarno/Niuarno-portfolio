import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// POST - Seed initial data (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already seeded
    const existingProjects = await db.project.count();
    if (existingProjects > 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Database already seeded" 
      });
    }

    // Seed default projects
    const defaultProjects = [
      {
        title: "E-Commerce Fashion Store",
        description: "A modern Shopify store for a fashion brand with custom product pages and seamless checkout experience.",
        category: "Shopify",
        tags: "Shopify,E-commerce,Custom Theme",
        color: "from-green-500 to-teal-500",
        featured: true,
        order: 1,
      },
      {
        title: "Corporate Business Website",
        description: "Professional WordPress website for a consulting firm with custom post types and advanced SEO.",
        category: "WordPress",
        tags: "WordPress,Business,SEO",
        color: "from-blue-500 to-cyan-500",
        featured: true,
        order: 2,
      },
      {
        title: "Creative Portfolio",
        description: "Stunning Wix website for a photographer showcasing their work with beautiful galleries.",
        category: "Wix",
        tags: "Wix,Portfolio,Velo",
        color: "from-purple-500 to-pink-500",
        featured: true,
        order: 3,
      },
      {
        title: "Online Learning Platform",
        description: "WordPress membership site with WooCommerce subscriptions and course management.",
        category: "WordPress",
        tags: "WordPress,WooCommerce,Membership",
        color: "from-orange-500 to-red-500",
        featured: false,
        order: 4,
      },
      {
        title: "Restaurant Booking System",
        description: "Wix website with custom booking system, menu display, and online ordering integration.",
        category: "Wix",
        tags: "Wix,Booking,Custom",
        color: "from-amber-500 to-orange-500",
        featured: false,
        order: 5,
      },
      {
        title: "Health & Wellness Store",
        description: "Shopify store for health products with subscription management and loyalty program.",
        category: "Shopify",
        tags: "Shopify,E-commerce,Subscription",
        color: "from-emerald-500 to-green-500",
        featured: false,
        order: 6,
      },
    ];

    for (const project of defaultProjects) {
      await db.project.create({ data: project });
    }

    // Seed default services
    const defaultServices = [
      {
        title: "WordPress Development",
        description: "Custom WordPress solutions tailored to your business needs, from simple blogs to complex e-commerce platforms.",
        icon: "Globe",
        features: "Custom Theme Development,Plugin Development & Customization,WooCommerce Integration,Speed Optimization,Security Hardening,Maintenance & Support",
        color: "from-cyan-500 to-blue-500",
        order: 1,
      },
      {
        title: "Wix Website Design",
        description: "Stunning Wix websites that combine beautiful design with powerful functionality for your business.",
        icon: "Palette",
        features: "Custom Design Implementation,Velo JavaScript Development,Wix Stores Setup,Booking Systems,SEO Optimization,Mobile Responsiveness",
        color: "from-purple-500 to-pink-500",
        order: 2,
      },
      {
        title: "Shopify Stores",
        description: "High-converting Shopify e-commerce stores designed to maximize sales and customer satisfaction.",
        icon: "Zap",
        features: "Store Setup & Configuration,Custom Theme Development,App Integration,Payment Gateway Setup,Inventory Management,Conversion Optimization",
        color: "from-green-500 to-teal-500",
        order: 3,
      },
    ];

    for (const service of defaultServices) {
      await db.service.create({ data: service });
    }

    // Seed default skills
    const defaultSkills = [
      { name: "WordPress", level: 95, icon: "Database", category: "CMS", order: 1 },
      { name: "Wix", level: 90, icon: "Globe", category: "CMS", order: 2 },
      { name: "Shopify", level: 88, icon: "Layers", category: "CMS", order: 3 },
      { name: "HTML/CSS", level: 95, icon: "Code", category: "Frontend", order: 4 },
      { name: "JavaScript", level: 85, icon: "Braces", category: "Frontend", order: 5 },
      { name: "React/Next.js", level: 80, icon: "Github", category: "Frontend", order: 6 },
    ];

    for (const skill of defaultSkills) {
      await db.skill.create({ data: skill });
    }

    // Seed default experiences
    const defaultExperiences = [
      { year: "2019", title: "Started Web Development", description: "Began my journey in web development, learning HTML, CSS, and JavaScript fundamentals.", order: 1 },
      { year: "2020", title: "WordPress Specialization", description: "Focused on WordPress development, creating custom themes and plugins for clients.", order: 2 },
      { year: "2021", title: "CMS Expert", description: "Expanded expertise to Wix and Shopify, becoming a versatile CMS developer.", order: 3 },
      { year: "2022", title: "Freelance Career", description: "Launched full-time freelance career, serving clients from around the world.", order: 4 },
      { year: "2023", title: "Brand Launch", description: "Established Niuarno as my professional brand for web development services.", order: 5 },
      { year: "Present", title: "Continued Growth", description: "Building modern web solutions and helping businesses thrive online.", order: 6 },
    ];

    for (const exp of defaultExperiences) {
      await db.experience.create({ data: exp });
    }

    // Seed default social links
    const defaultSocials = [
      { platform: "GitHub", url: "https://github.com/niuarno", icon: "Github", order: 1 },
      { platform: "LinkedIn", url: "https://linkedin.com/in/niuarno", icon: "Linkedin", order: 2 },
      { platform: "Twitter", url: "https://twitter.com/niuarno", icon: "Twitter", order: 3 },
    ];

    for (const social of defaultSocials) {
      await db.socialLink.create({ data: social });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully" 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
