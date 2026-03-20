"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Facebook,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingOrbs, GridBackground } from "@/components/animations/FloatingElements";
import { MagneticButton } from "@/components/animations/InteractiveEffects";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await fetch("/api/settings");
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings || {});
      } catch {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: settings.email || "contact@niuarno.com",
      href: `mailto:${settings.email || "contact@niuarno.com"}`,
    },
    {
      icon: Phone,
      title: "Phone",
      value: settings.phone || "+880 1974-962406",
      href: `tel:${settings.phone || "+8801974962406"}`,
    },
    {
      icon: MapPin,
      title: "Location",
      value: settings.location || "Available Worldwide",
      href: "#",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: settings.responseTime || "Within 24 Hours",
      href: "#",
    },
  ];

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

  // Default social links if none set
  const displaySocialLinks = socialLinks.length > 0 ? socialLinks : [
    { icon: Github, href: "https://github.com/niuarno", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/niuarno", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/niuarno", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/niuarno", label: "Facebook" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <FloatingOrbs />
      <GridBackground />

      {/* Hero Section */}
      <motion.section style={{ y: heroY }} className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-responsive">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Contact</span>
            </motion.div>

            <AnimatedText className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" delay={0.2}>
              Let&apos;s Work Together
            </AnimatedText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
            >
              Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing together.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Contact Content */}
      <section className="relative py-16 sm:py-24">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                  Get in <span className="gradient-text">Touch</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
              </ScrollReveal>

              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <ScrollReveal key={info.title} delay={index * 0.1}>
                      <motion.a
                        href={info.href}
                        whileHover={{ y: -4 }}
                        className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-muted-foreground text-sm">{info.value}</p>
                      </motion.a>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <ScrollReveal delay={0.4}>
                <div className="pt-8">
                  <h3 className="font-semibold mb-4">Connect with me</h3>
                  <div className="flex gap-4">
                    {displaySocialLinks.map((social) => (
                      <MagneticButton key={social.label}>
                        <motion.a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <social.icon className="w-5 h-5" />
                        </motion.a>
                      </MagneticButton>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <ScrollReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
                <div className="relative p-6 sm:p-8 rounded-3xl bg-card border border-border">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                      <p className="text-muted-foreground mb-8">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full">
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive"
                        >
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm">{error}</span>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="bg-muted border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="bg-muted border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="Project inquiry"
                          required
                          className="bg-muted border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project..."
                          rows={6}
                          required
                          className="bg-muted border-border resize-none"
                        />
                      </div>

                      <MagneticButton>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full py-6"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </MagneticButton>
                    </form>
                  )}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 sm:py-24 bg-card/50">
        <div className="container-responsive">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Common <span className="gradient-text">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "What is your typical response time?", a: "I typically respond within 24 hours during business days." },
              { q: "Do you work with international clients?", a: "Yes! I work with clients from all around the world." },
              { q: "What information should I include?", a: "Include your project goals, timeline, and budget range." },
              { q: "Do you offer maintenance?", a: "Yes, I offer various maintenance packages for your website." },
            ].map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-xl bg-background border border-border">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
