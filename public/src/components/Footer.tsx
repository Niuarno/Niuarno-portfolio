"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUpRight, Globe, Facebook } from "lucide-react";
import { useState, useEffect } from "react";

interface Settings {
  [key: string]: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Facebook,
};

const defaultSocialLinks = [
  { icon: Github, href: "https://github.com/niuarno", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/niuarno", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/niuarno", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/niuarno", label: "Facebook" },
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await fetch("/api/settings");
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings || {});
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    };
    fetchData();
  }, []);

  // Build social links from settings
  const socialLinks = [];
  
  if (settings.githubUrl) {
    socialLinks.push({ icon: Github, href: settings.githubUrl, label: "GitHub" });
  }
  if (settings.linkedinUrl) {
    socialLinks.push({ icon: Linkedin, href: settings.linkedinUrl, label: "LinkedIn" });
  }
  if (settings.twitterUrl) {
    socialLinks.push({ icon: Twitter, href: settings.twitterUrl, label: "Twitter" });
  }
  if (settings.facebookUrl) {
    socialLinks.push({ icon: Facebook, href: settings.facebookUrl, label: "Facebook" });
  }

  // Use default if no social links in settings
  const displaySocials = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  return (
    <footer className="relative mt-auto border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">N</span>
                </div>
                <span className="text-xl font-bold gradient-text">{settings.siteName || "Niuarno"}</span>
              </motion.div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              {settings.siteDescription || "Crafting digital experiences with precision and passion. Expert in WordPress, Wix, and Shopify development."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              {displaySocials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Let&apos;s build something amazing together.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {settings.siteName || "Niuarno"}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Designed & Built by <span className="text-primary">{settings.ownerName || "Saheduzzaman Nour"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
