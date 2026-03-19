"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Globe,
  ShoppingCart,
  Palette,
  RefreshCw,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingOrbs, GridBackground } from "@/components/animations/FloatingElements";
import { MagneticButton, TiltCard } from "@/components/animations/InteractiveEffects";
import { Footer } from "@/components/Footer";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string | null;
  link: string | null;
  github: string | null;
  color: string;
  featured: boolean;
}

const categories = ["All", "WordPress", "Wix", "Shopify", "Custom"];

const stats = [
  { icon: Globe, value: "50+", label: "Websites Built" },
  { icon: ShoppingCart, value: "20+", label: "E-commerce Stores" },
  { icon: Palette, value: "30+", label: "Custom Designs" },
];

export default function PortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

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
              <ExternalLink className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Portfolio</span>
            </motion.div>

            <AnimatedText
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              delay={0.2}
            >
              Featured Projects & Works
            </AnimatedText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
            >
              A showcase of my best work across WordPress, Wix, and Shopify platforms.
              Each project represents my commitment to quality and client satisfaction.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="relative py-8">
        <div className="container-responsive">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="relative py-8">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative py-8 sm:py-16">
        <div className="container-responsive">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TiltCard>
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative h-full rounded-2xl bg-card border border-border overflow-hidden"
                      >
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                          
                          {/* Placeholder visual */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-3xl font-bold text-white/80">
                                {project.title.charAt(0)}
                              </span>
                            </div>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                            {project.link && (
                              <motion.a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </motion.a>
                            )}
                            {project.github && (
                              <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground"
                              >
                                <Github className="w-5 h-5" />
                              </motion.a>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.split(",").map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
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
                  Have a Project in <span className="gradient-text">Mind</span>?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Let&apos;s collaborate to create something exceptional. I&apos;m always excited to work on new challenges.
                </p>
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full glow-cyan hover:opacity-90 transition-all"
                  >
                    Start a Conversation
                    <ArrowUpRight className="w-5 h-5" />
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
