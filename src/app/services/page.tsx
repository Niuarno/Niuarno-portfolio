"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Globe,
  ShoppingCart,
  Palette,
  Settings,
  Search,
  Shield,
  Zap,
  Code,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingOrbs, GridBackground } from "@/components/animations/FloatingElements";
import { MagneticButton, TiltCard } from "@/components/animations/InteractiveEffects";
import { Footer } from "@/components/Footer";

const services = [
  {
    icon: Globe,
    title: "WordPress Development",
    description: "Custom WordPress solutions tailored to your business needs, from simple blogs to complex e-commerce platforms.",
    features: [
      "Custom Theme Development",
      "Plugin Development & Customization",
      "WooCommerce Integration",
      "Speed Optimization",
      "Security Hardening",
      "Maintenance & Support",
    ],
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Palette,
    title: "Wix Website Design",
    description: "Stunning Wix websites that combine beautiful design with powerful functionality for your business.",
    features: [
      "Custom Design Implementation",
      "Velo JavaScript Development",
      "Wix Stores Setup",
      "Booking Systems",
      "SEO Optimization",
      "Mobile Responsiveness",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: ShoppingCart,
    title: "Shopify Stores",
    description: "High-converting Shopify e-commerce stores designed to maximize sales and customer satisfaction.",
    features: [
      "Store Setup & Configuration",
      "Custom Theme Development",
      "App Integration",
      "Payment Gateway Setup",
      "Inventory Management",
      "Conversion Optimization",
    ],
    color: "from-green-500 to-teal-500",
  },
];

const additionalServices = [
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Improve your search rankings and drive organic traffic to your website.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Websites that look and work perfectly on all devices and screen sizes.",
  },
  {
    icon: Settings,
    title: "Website Maintenance",
    description: "Regular updates, backups, and security monitoring for peace of mind.",
  },
  {
    icon: Shield,
    title: "Security Solutions",
    description: "Protect your website from threats with robust security measures.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up your website for better user experience and SEO rankings.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Setup",
    description: "Track and analyze your website performance with comprehensive analytics.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "Understanding your goals, requirements, and vision for the project.",
  },
  {
    step: "02",
    title: "Planning",
    description: "Creating a detailed roadmap and timeline for your project.",
  },
  {
    step: "03",
    title: "Design",
    description: "Crafting beautiful, user-friendly designs that align with your brand.",
  },
  {
    step: "04",
    title: "Development",
    description: "Building your website with clean, efficient, and scalable code.",
  },
  {
    step: "05",
    title: "Testing",
    description: "Rigorous testing to ensure everything works perfectly.",
  },
  {
    step: "06",
    title: "Launch",
    description: "Deploying your website and providing ongoing support.",
  },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <FloatingOrbs />
      <GridBackground />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative pt-32 pb-16 sm:pt-40 sm:pb-24"
      >
        <div className="container-responsive">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Services</span>
            </motion.div>

            <AnimatedText
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              delay={0.2}
            >
              Professional Web Development Services
            </AnimatedText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
            >
              From concept to launch, I provide comprehensive web development services
              that help businesses establish a powerful online presence.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Main Services */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.15}>
                <TiltCard>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative h-full p-6 lg:p-8 rounded-2xl bg-card border border-border overflow-hidden"
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>

                    {/* Features */}
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-8">
                      <MagneticButton>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 text-primary font-medium group/link"
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </MagneticButton>
                    </div>
                  </motion.div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="relative py-16 sm:py-24 bg-card/50">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Additional <span className="gradient-text">Services</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Complementary services to enhance your website&apos;s performance and success.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-xl bg-background border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                My <span className="gradient-text">Process</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A streamlined approach to delivering exceptional results.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative p-6 rounded-xl bg-card border border-border overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 text-7xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-primary mb-2">{item.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-muted p-8 sm:p-12 lg:p-16 border border-border text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Ready to Start Your <span className="gradient-text">Project</span>?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Let&apos;s discuss how I can help bring your vision to life with a website that stands out.
                </p>
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full glow-cyan hover:opacity-90 transition-all"
                  >
                    Get a Free Quote
                    <ArrowRight className="w-5 h-5" />
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
