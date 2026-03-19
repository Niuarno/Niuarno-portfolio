"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Code,
  Database,
  Figma,
  Github,
  Globe,
  Layers,
  Lightbulb,
  Users,
  Award,
  Target,
  Rocket,
  RefreshCw,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingOrbs, GridBackground } from "@/components/animations/FloatingElements";
import { TiltCard } from "@/components/animations/InteractiveEffects";
import { Footer } from "@/components/Footer";

interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string;
  category: string;
}

interface Experience {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface Settings {
  [key: string]: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Code,
  Database,
  Figma,
  Github,
  Globe,
  Layers,
  Briefcase: Code,
  Braces: Code,
};

const defaultSkills = [
  { name: "WordPress", level: 95, icon: Database },
  { name: "Wix", level: 90, icon: Globe },
  { name: "Shopify", level: 88, icon: Layers },
  { name: "HTML/CSS", level: 95, icon: Code },
  { name: "JavaScript", level: 85, icon: Figma },
  { name: "React/Next.js", level: 80, icon: Github },
];

const defaultExperiences = [
  { year: "2019", title: "Started Web Development", description: "Began my journey in web development, learning HTML, CSS, and JavaScript fundamentals." },
  { year: "2020", title: "WordPress Specialization", description: "Focused on WordPress development, creating custom themes and plugins for clients." },
  { year: "2021", title: "CMS Expert", description: "Expanded expertise to Wix and Shopify, becoming a versatile CMS developer." },
  { year: "2022", title: "Freelance Career", description: "Launched full-time freelance career, serving clients from around the world." },
  { year: "2023", title: "Brand Launch", description: "Established Niuarno as my professional brand for web development services." },
  { year: "Present", title: "Continued Growth", description: "Building modern web solutions and helping businesses thrive online." },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Always exploring new technologies and creative solutions to deliver cutting-edge websites.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Attention to detail in every line of code, ensuring pixel-perfect implementations.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working closely with clients to understand their vision and exceed expectations.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Building fast, optimized websites that provide exceptional user experiences.",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, skillsRes, experiencesRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/skills"),
          fetch("/api/experiences"),
        ]);
        
        const settingsData = await settingsRes.json();
        const skillsData = await skillsRes.json();
        const experiencesData = await experiencesRes.json();
        
        setSettings(settingsData.settings || {});
        setSkills(skillsData.skills || []);
        setExperiences(experiencesData.experiences || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displaySkills = skills.length > 0 
    ? skills.map((s) => ({
        name: s.name,
        level: s.level,
        icon: iconMap[s.icon] || Code,
      }))
    : defaultSkills;

  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

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
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">About Me</span>
            </motion.div>

            <AnimatedText
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              delay={0.2}
            >
              Passionate About Creating Digital Excellence
            </AnimatedText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
            >
              I&apos;m {settings.ownerName || "Saheduzzaman Nour"}, a dedicated web developer with a passion for building
              exceptional digital experiences. With expertise in WordPress, Wix, and Shopify,
              I help businesses establish powerful online presences.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* About Content */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Story */}
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  My <span className="gradient-text">Story</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    My journey in web development began with a simple curiosity about how websites work.
                    What started as a hobby quickly evolved into a passionate career. I discovered the
                    power of content management systems and fell in love with their ability to empower
                    businesses and individuals to manage their online presence effectively.
                  </p>
                  <p>
                    Over the years, I&apos;ve had the privilege of working with diverse clients from various
                    industries. Each project has taught me something new and helped me refine my skills.
                    I believe in continuous learning and staying updated with the latest web technologies
                    and design trends.
                  </p>
                  <p>
                    Today, under my brand <span className="text-primary font-semibold">Niuarno</span>,
                    I offer comprehensive web development services that help businesses thrive in the
                    digital landscape. My goal is simple: create websites that not only look stunning
                    but also deliver measurable results.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Photo/Visual */}
            <ScrollReveal delay={0.2}>
              <TiltCard className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                <div className="relative h-full rounded-3xl bg-gradient-to-br from-card to-muted border border-border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary-foreground">
                          {(settings.ownerName || "SN").split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{settings.ownerName || "Saheduzzaman Nour"}</h3>
                      <p className="text-muted-foreground">{settings.ownerRole || "Web Developer & CMS Expert"}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Technical <span className="gradient-text">Skills</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Proficient in modern web technologies and platforms to deliver exceptional results.
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySkills.map((skill, index) => (
                <ScrollReveal key={skill.name} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <skill.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">{skill.name}</h3>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground text-right">
                      {skill.level}%
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 sm:py-24 bg-card/50">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                My <span className="gradient-text">Values</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The principles that guide my work and relationships with clients.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="text-center p-6 rounded-xl bg-background border border-border"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                My <span className="gradient-text">Journey</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Key milestones in my career as a web developer.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {displayExperiences.map((item, index) => (
              <ScrollReveal key={item.year + index} delay={index * 0.1}>
                <div className={`relative flex gap-6 mb-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 mt-2" />

                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-xl bg-card border border-border"
                    >
                      <span className="text-primary font-semibold">{item.year}</span>
                      <h3 className="text-lg font-bold mt-1 mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
