// Home page - Updated
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Palette,
  Zap,
  ChevronDown,
  Sparkles,
  Globe,
  RefreshCw,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingOrbs, GridBackground } from "@/components/animations/FloatingElements";
import { MagneticButton } from "@/components/animations/InteractiveEffects";
import { Footer } from "@/components/Footer";

interface Settings {
  [key: string]: string;
}

const defaultServices = [
  {
    icon: Code2,
    title: "WordPress Development",
    description: "Custom themes, plugins, and e-commerce solutions built with clean code and best practices.",
  },
  {
    icon: Palette,
    title: "Wix Website Design",
    description: "Stunning, responsive websites using Wix's powerful platform with custom functionality.",
  },
  {
    icon: Zap,
    title: "Shopify Stores",
    description: "High-converting e-commerce stores that drive sales and deliver exceptional user experiences.",
  },
];

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data.settings || {});
      } catch {
        console.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <FloatingOrbs />
      <GridBackground />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <div className="container-responsive relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                {settings.heroBadge || "Available for Freelance Projects"}
              </span>
            </motion.div>

            {/* Main Title */}
            <AnimatedText
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              delay={0.2}
            >
              {settings.heroTitle || "Building Digital Experiences That Convert"}
            </AnimatedText>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
                </span>
              ) : (
                <>
                  Hi, I&apos;m <span className="text-primary font-semibold">{settings.ownerName || "Saheduzzaman Nour"}</span>.
                  {settings.heroSubtitle || " A web developer specializing in WordPress, Wix, and Shopify. I create modern, high-performance websites that grow your business."}
                </>
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MagneticButton>
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all"
                >
                  View My Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-colors"
                >
                  Get In Touch
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="relative py-24 sm:py-32">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                What I Do
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
                Expert <span className="gradient-text">CMS Development</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specialized in building custom solutions on the world&apos;s most popular content management systems.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {defaultServices.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="container-responsive relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm sm:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="relative py-16">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ScrollReveal>
              <motion.a
                href={`mailto:${settings.email || "contact@niuarno.com"}`}
                whileHover={{ y: -4 }}
                className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground text-sm">{settings.email || "contact@niuarno.com"}</p>
                </div>
              </motion.a>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground text-sm">{settings.location || "Available Worldwide"}</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-muted-foreground text-sm">{settings.responseTime || "Within 24 Hours"}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-muted p-8 sm:p-12 lg:p-16 border border-border">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  {settings.ctaTitle || "Let's Create Something Amazing"}
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {settings.ctaDescription || "Ready to take your online presence to the next level? I'm here to help you build a website that stands out and delivers results."}
                </p>
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all"
                  >
                    Start a Project
                    <Globe className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
