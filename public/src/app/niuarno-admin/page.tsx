"use client";

// Admin Panel Component
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Reply,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Briefcase,
  Code,
  Calendar,
  ExternalLink,
  Send,
  Star,
  StarOff,
  User,
  Activity,
  Users,
  Server,
  Shield,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bookmark,
  MessageSquare,
  TrendingUp,
  Globe,
  Wifi,
  ArrowRight,
  MapPin,
  Monitor,
  Tablet,
  Smartphone,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Types
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
  order: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  reply: string | null;
  important?: boolean;
  createdAt: string;
}

interface Settings {
  [key: string]: string;
}

interface VisitorStats {
  onlineVisitors: number;
  totalVisitors: number;
  uniqueVisitors: number;
  totalPageViews: number;
  countryStats: Array<{ country: string; countryCode: string; _count: { id: number } }>;
  deviceBreakdown: Array<{ device: string; _count: { id: number } }>;
  browserBreakdown: Array<{ browser: string; _count: { id: number } }>;
  osBreakdown: Array<{ os: string; _count: { id: number } }>;
  hourlyData: Array<{ time: string; visitors: number }>;
  visitors: Array<{
    id: string;
    sessionId: string;
    country: string;
    countryCode: string;
    city: string | null;
    page: string;
    device: string;
    browser: string | null;
    os: string | null;
    isOnline: boolean;
    lastActive: string;
    createdAt: string;
  }>;
}

// Context
const AdminContext = createContext<{
  token: string;
  setToken: (t: string) => void;
  refresh: () => void;
  refreshKey: number;
  setActiveTab: (t: string) => void;
}>({
  token: "",
  setToken: () => {},
  refresh: () => {},
  refreshKey: 0,
  setActiveTab: () => {},
});

const ADMIN_TOKEN = "niuarno-admin-2024";
const REMEMBER_KEY = "niuarno_admin_remember";

// Country coordinates for world map
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 39.8283, lng: -98.5795 },
  BD: { lat: 23.685, lng: 90.3563 },
  IN: { lat: 20.5937, lng: 78.9629 },
  GB: { lat: 55.3781, lng: -3.436 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  CA: { lat: 56.1304, lng: -106.3468 },
  AU: { lat: -25.2744, lng: 133.7751 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  CN: { lat: 35.8617, lng: 104.1954 },
  RU: { lat: 61.524, lng: 105.3188 },
  BR: { lat: -14.235, lng: -51.9253 },
  MX: { lat: 23.6345, lng: -102.5528 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  NL: { lat: 52.1326, lng: 5.2913 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.472, lng: 8.4689 },
  PL: { lat: 51.9194, lng: 19.1451 },
  TR: { lat: 38.9637, lng: 35.2433 },
  SA: { lat: 23.8859, lng: 45.0792 },
  AE: { lat: 23.4241, lng: 53.8478 },
  SG: { lat: 1.3521, lng: 103.8198 },
  MY: { lat: 4.2105, lng: 101.9758 },
  ID: { lat: -0.7893, lng: 113.9213 },
  TH: { lat: 15.87, lng: 100.9925 },
  PH: { lat: 12.8797, lng: 121.774 },
  VN: { lat: 14.0583, lng: 108.2772 },
  EG: { lat: 26.8206, lng: 30.8025 },
  NG: { lat: 9.082, lng: 8.6753 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  AR: { lat: -38.4161, lng: -63.6167 },
  CL: { lat: -35.6751, lng: -71.543 },
  CO: { lat: 4.5709, lng: -74.2973 },
  PE: { lat: -9.19, lng: -75.0152 },
  NZ: { lat: -40.9006, lng: 174.886 },
  IE: { lat: 53.1424, lng: -7.6921 },
  BE: { lat: 50.5039, lng: 4.4699 },
  AT: { lat: 47.5162, lng: 14.5501 },
  CH: { lat: 46.8182, lng: 8.2275 },
  PT: { lat: 39.3999, lng: -8.2245 },
  DK: { lat: 56.2639, lng: 9.5018 },
  FI: { lat: 61.9241, lng: 25.7482 },
  CZ: { lat: 49.8175, lng: 15.473 },
  RO: { lat: 45.9432, lng: 24.9668 },
  HU: { lat: 47.1625, lng: 19.5033 },
  GR: { lat: 39.0742, lng: 21.8243 },
  IL: { lat: 31.0461, lng: 34.8516 },
  PK: { lat: 30.3753, lng: 69.3451 },
  NP: { lat: 28.3949, lng: 84.124 },
  LK: { lat: 7.8731, lng: 80.7718 },
  MM: { lat: 21.9162, lng: 95.9562 },
  KH: { lat: 12.5657, lng: 104.991 },
  LO: { lat: 0, lng: 0 }, // Local
  XX: { lat: 0, lng: 0 }, // Unknown
};

// Helper functions
function saveRememberedToken(token: string) {
  const data = { token, expiry: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  localStorage.setItem(REMEMBER_KEY, JSON.stringify(data));
}

function getRememberedToken(): string | null {
  try {
    const stored = localStorage.getItem(REMEMBER_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    if (Date.now() > data.expiry) {
      localStorage.removeItem(REMEMBER_KEY);
      return null;
    }
    return data.token;
  } catch {
    return null;
  }
}

function clearRememberedToken() {
  localStorage.removeItem(REMEMBER_KEY);
}

// Live Pulse Indicator
function LivePulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
  );
}

// Animated Counter
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <span>{displayValue.toLocaleString()}</span>;
}

// Modern Speedometer - Fixed visual glitch
function Speedometer({ value, maxValue = 300 }: { value: number; maxValue?: number }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees
  
  const getColor = () => {
    if (percentage < 33) return "#22c55e";
    if (percentage < 66) return "#eab308";
    return "#ef4444";
  };
  
  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24 sm:w-48 sm:h-28">
        <svg viewBox="0 0 120 70" className="w-full h-full overflow-visible">
          {/* Background arc */}
          <path
            d="M 12 60 A 48 48 0 0 1 108 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/30"
            strokeLinecap="round"
          />
          {/* Colored progress arc */}
          <path
            d="M 12 60 A 48 48 0 0 1 108 60"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.51} 151`}
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 0.5s ease" }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick, i) => {
            const angle = (tick / 100) * 180 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + Math.cos(rad) * 40;
            const y1 = 60 + Math.sin(rad) * 40;
            const x2 = 60 + Math.cos(rad) * 48;
            const y2 = 60 + Math.sin(rad) * 48;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50" />
            );
          })}
        </svg>
        
        {/* Needle - positioned above the arc */}
        <div 
          className="absolute left-1/2 top-[60%] origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, transition: "transform 0.5s ease" }}
        >
          <div className="w-0.5 h-8 sm:h-10 bg-gradient-to-t from-muted to-foreground rounded-full" 
               style={{ boxShadow: `0 0 6px ${color}` }} />
        </div>
        
        {/* Center dot */}
        <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground shadow-lg" />
      </div>
      
      {/* Value display - outside the dial */}
      <div className="text-center -mt-2">
        <span className="text-2xl sm:text-3xl font-bold" style={{ color }}>{value}</span>
        <span className="text-sm text-muted-foreground ml-1">ms</span>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Server Ping</p>
    </div>
  );
}

// World Map Component
function WorldMap({ countryStats, onlineVisitors }: { countryStats: Array<{ country: string; countryCode: string; _count: { id: number } }>; onlineVisitors: number }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Simple world map paths (simplified SVG)
  const worldMapPath = "M0,50 Q30,20 60,50 T120,50 T180,50 T240,50 T300,50 L300,150 Q270,180 240,150 T180,150 T120,150 T60,150 T0,150 Z";

  return (
    <div className="relative w-full h-48 sm:h-64 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* World map SVG */}
      <svg viewBox="0 0 360 180" className="w-full h-full opacity-20">
        <path d={worldMapPath} fill="currentColor" className="text-muted-foreground" />
      </svg>

      {/* Visitor dots */}
      {countryStats.slice(0, 15).map((country, index) => {
        const coords = COUNTRY_COORDS[country.countryCode];
        if (!coords) return null;
        
        // Convert lat/lng to SVG coordinates
        const x = ((coords.lng + 180) / 360) * 100;
        const y = ((90 - coords.lat) / 180) * 100;
        const count = country._count.id;
        const dotSize = Math.min(6 + count * 0.5, 16);

        return (
          <motion.div
            key={country.countryCode}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredCountry(country.countryCode)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            {/* Pulse animation */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              className="absolute rounded-full bg-primary/50"
              style={{ width: dotSize * 2, height: dotSize * 2, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            />
            {/* Main dot */}
            <div
              className="rounded-full bg-primary shadow-lg cursor-pointer transition-transform hover:scale-125"
              style={{ width: dotSize, height: dotSize, boxShadow: "0 0 10px rgba(var(--primary), 0.5)" }}
            />
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredCountry === country.countryCode && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg whitespace-nowrap z-10"
                >
                  <span className="font-medium">{country.country}</span>
                  <span className="text-muted-foreground ml-1">({count} visitors)</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{onlineVisitors} online</span>
        </div>
      </div>

      {/* Country count */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        {countryStats.length} countries
      </div>
    </div>
  );
}

// Time Range Selector
function TimeRangeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ranges = [
    { id: "24h", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "15d", label: "15 Days" },
    { id: "30d", label: "30 Days" },
  ];

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onChange(range.id)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            value === range.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

// Sidebar
function Sidebar({ 
  activeTab, setActiveTab, isOpen, setIsOpen, onLogout 
}: { 
  activeTab: string; 
  setActiveTab: (t: string) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  onLogout: () => void;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "site-activity", label: "Site & Activity", icon: Activity, live: true },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-xl border-r border-border z-50 lg:translate-x-0 lg:!translate-x-0"
      >
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                <span className="text-lg font-bold text-white">N</span>
              </motion.div>
              <div>
                <h1 className="font-bold text-sm sm:text-base">Niuarno Admin</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Content Management</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-2 sm:p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-primary/20 to-accent/10 text-primary font-medium border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.live && <LivePulse />}
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all text-sm sm:text-base">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// Dashboard
function Dashboard() {
  const { token, refreshKey, setActiveTab } = useContext(AdminContext);
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverPing, setServerPing] = useState(0);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [projectsRes, messagesRes, visitorsRes, pingStart] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/visitors?range=${timeRange}`, { headers: { Authorization: `Bearer ${token}` } }),
          Promise.resolve(Date.now()),
        ]);

        const projectsData = await projectsRes.json();
        const messagesData = await messagesRes.json();
        const visitorsData = await visitorsRes.json();
        
        // Calculate ping
        const pingEnd = Date.now();
        setServerPing(pingEnd - pingStart);

        setStats({
          projects: projectsData.projects?.length || 0,
          messages: messagesData.messages?.length || 0,
          unread: messagesData.messages?.filter((m: Message) => m.status === "unread").length || 0,
        });

        setVisitorStats(visitorsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token, refreshKey, timeRange]);

  const statCards = [
    { label: "Total Projects", value: stats.projects, icon: FolderKanban, color: "from-cyan-500 to-blue-500", change: "+2 this week" },
    { label: "Total Messages", value: stats.messages, icon: Mail, color: "from-purple-500 to-pink-500", change: `${stats.unread} unread` },
    { label: "Unread Messages", value: stats.unread, icon: AlertCircle, color: "from-orange-500 to-red-500", change: "Needs attention" },
  ];

  const quickActions = [
    { label: "Add Project", icon: Plus, tab: "projects", color: "from-cyan-500 to-blue-500" },
    { label: "View Messages", icon: Mail, tab: "messages", color: "from-purple-500 to-pink-500" },
    { label: "Edit Settings", icon: Settings, tab: "settings", color: "from-green-500 to-teal-500" },
    { label: "Site Activity", icon: Activity, tab: "site-activity", color: "from-orange-500 to-red-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold"><AnimatedCounter value={stat.value} /></p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
      >
        <h3 className="font-semibold mb-4 text-base sm:text-lg">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(action.tab)}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all`}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Site Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-base sm:text-lg">Site Performance</h3>
          </div>
          <div className="flex items-center gap-2">
            <LivePulse />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Visitor Counter */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Online Now</span>
            </div>
            <motion.div
              key={visitorStats?.onlineVisitors || 0}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-primary"
            >
              <AnimatedCounter value={visitorStats?.onlineVisitors || 0} duration={500} />
            </motion.div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{visitorStats?.totalVisitors || 0} total visitors ({timeRange})</span>
            </div>
          </div>

          {/* Speedometer */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-muted/30 border border-border">
            <Speedometer value={serverPing} maxValue={300} />
          </div>

          {/* Uptime Chart */}
          <div className="flex flex-col justify-center p-4 sm:p-6 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs sm:text-sm font-medium">Hourly Visitors</span>
              </div>
            </div>
            <div className="h-16 sm:h-24 flex items-end gap-0.5">
              {(visitorStats?.hourlyData || []).slice(-12).map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min((point.visitors / Math.max(...(visitorStats?.hourlyData?.map(p => p.visitors) || [1]))) * 100, 100)}%` }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 bg-primary/60 rounded-t-sm min-h-[4px]"
                  title={`${point.time}: ${point.visitors} visitors`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>12h ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("site-activity")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl text-sm font-medium hover:border-primary/40 transition-colors"
          >
            <Activity className="w-4 h-4" />
            View Full Status
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* View Site Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center">
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <ExternalLink className="w-4 h-4" />
          View Your Site
        </a>
      </motion.div>
    </div>
  );
}

// Site & Activity Component
function SiteActivity() {
  const { token, refreshKey } = useContext(AdminContext);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [visitorsRes, messagesRes] = await Promise.all([
          fetch(`/api/visitors?range=${timeRange}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        const visitorsData = await visitorsRes.json();
        const messagesData = await messagesRes.json();
        
        setVisitorStats(visitorsData);
        setMessages(messagesData.messages || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, refreshKey, timeRange]);

  const toggleImportant = async (messageId: string, currentStatus: boolean) => {
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: messageId, important: !currentStatus }),
      });
    } catch {
      console.error("Failed to update message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const unreadOrImportant = messages.filter(m => m.status === "unread" || m.important);

  const performanceMetrics = [
    { label: "Total Visitors", value: visitorStats?.totalVisitors || 0, icon: Users, color: "text-green-500", trend: "up" },
    { label: "Page Views", value: visitorStats?.totalPageViews || 0, icon: Activity, color: "text-blue-500", trend: "up" },
    { label: "Countries", value: visitorStats?.countryStats?.length || 0, icon: Globe, color: "text-purple-500", trend: "stable" },
    { label: "Online Now", value: visitorStats?.onlineVisitors || 0, icon: Wifi, color: "text-cyan-500", trend: "up" },
  ];

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      default: return Monitor;
    }
  };

  const getBrowserIcon = (browser: string) => {
    // All browser icons use Globe since Chrome, Firefox, Safari aren't available
    return Globe;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Site & Activity</h2>
          <LivePulse />
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Visitor Counter - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 border border-primary/20 p-6 sm:p-8"
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              >
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Visitors</p>
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    key={visitorStats?.onlineVisitors || 0}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl font-bold"
                  >
                    <AnimatedCounter value={visitorStats?.onlineVisitors || 0} duration={500} />
                  </motion.span>
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> live
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{visitorStats?.countryStats?.length || 0} countries</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -left-20 -bottom-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        />
      </motion.div>

      {/* World Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-base sm:text-lg">Visitor Locations</h3>
            </div>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {visitorStats?.countryStats?.length || 0} countries
            </span>
          </div>
        </div>
        <div className="p-4">
          <WorldMap 
            countryStats={visitorStats?.countryStats || []} 
            onlineVisitors={visitorStats?.onlineVisitors || 0} 
          />
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 sm:p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              {metric.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
              {metric.trend === "stable" && <Minus className="w-4 h-4 text-yellow-500" />}
            </div>
            <p className="text-lg sm:text-xl font-bold">{metric.value.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Device Breakdown */}
        <div className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            Device Breakdown
          </h3>
          <div className="space-y-3">
            {(visitorStats?.deviceBreakdown || []).map((item) => {
              const DeviceIcon = getDeviceIcon(item.device);
              const total = visitorStats?.totalVisitors || 1;
              const percentage = Math.round((item._count.id / total) * 100);
              return (
                <div key={item.device} className="flex items-center gap-3">
                  <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{item.device}</span>
                      <span className="text-muted-foreground">{item._count.id}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Top Browsers
          </h3>
          <div className="space-y-3">
            {(visitorStats?.browserBreakdown || []).map((item) => {
              const BrowserIcon = getBrowserIcon(item.browser || "Other");
              return (
                <div key={item.browser} className="flex items-center gap-3">
                  <BrowserIcon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span>{item.browser || "Other"}</span>
                    <span className="text-muted-foreground">{item._count.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OS Breakdown */}
        <div className="p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
            <Apple className="w-4 h-4 text-primary" />
            Top Operating Systems
          </h3>
          <div className="space-y-3">
            {(visitorStats?.osBreakdown || []).map((item) => (
              <div key={item.os} className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 flex justify-between text-sm">
                  <span>{item.os || "Other"}</span>
                  <span className="text-muted-foreground">{item._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-base sm:text-lg">Recent Activity</h3>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 rounded-full">
            {unreadOrImportant.length} items
          </span>
        </div>

        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {unreadOrImportant.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No unread or important messages</p>
            </div>
          ) : (
            unreadOrImportant.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">{message.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{message.name}</span>
                      {message.status === "unread" && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">New</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => toggleImportant(message.id, message.important || false)}
                        className={`p-1.5 rounded transition-colors ${
                          message.important 
                            ? "text-yellow-500 bg-yellow-500/10" 
                            : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                        }`}
                      >
                        <Bookmark className="w-4 h-4" fill={message.important ? "currentColor" : "none"} />
                      </button>
                      <span className="text-xs text-muted-foreground">{message.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Projects Manager
function ProjectsManager() {
  const { token, refresh, refreshKey } = useContext(AdminContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", category: "WordPress", tags: "", image: "", link: "", github: "",
    color: "from-cyan-500 to-blue-500", featured: false,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [refreshKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/projects` : "/api/projects";
      const body = editing ? { ...formData, id: editing.id } : formData;
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setFormData({ title: "", description: "", category: "WordPress", tags: "", image: "", link: "", github: "", color: "from-cyan-500 to-blue-500", featured: false });
        refresh();
      }
    } catch {
      console.error("Failed to save project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setFormData({
      title: project.title, description: project.description, category: project.category,
      tags: project.tags, image: project.image || "", link: project.link || "", github: project.github || "",
      color: project.color, featured: project.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      refresh();
    } catch {
      console.error("Failed to delete project");
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: project.id, featured: !project.featured }),
      });
      refresh();
    } catch {
      console.error("Failed to update project");
    }
  };

  const colorOptions = ["from-cyan-500 to-blue-500", "from-purple-500 to-pink-500", "from-green-500 to-teal-500", "from-orange-500 to-red-500", "from-amber-500 to-orange-500", "from-violet-500 to-purple-500", "from-blue-500 to-cyan-500"];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormData({ title: "", description: "", category: "WordPress", tags: "", image: "", link: "", github: "", color: "from-cyan-500 to-blue-500", featured: false }); setShowForm(true); }} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-card rounded-2xl border border-border p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{editing ? "Edit Project" : "Add New Project"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-muted border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-md">
                      <option value="WordPress">WordPress</option>
                      <option value="Wix">Wix</option>
                      <option value="Shopify">Shopify</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="bg-muted border-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="WordPress, E-commerce" className="bg-muted border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button key={color} type="button" onClick={() => setFormData({ ...formData, color })} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${color} ${formData.color === color ? "ring-2 ring-primary ring-offset-2" : ""}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project URL</label>
                    <Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." className="bg-muted border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/..." className="bg-muted border-border" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="featured" className="text-sm">Featured Project</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1 gap-2"><Save className="w-4 h-4" /> {editing ? "Update" : "Create"} Project</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.div key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card/50 backdrop-blur-sm border border-border group overflow-hidden">
            {project.image ? (
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2"><div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>{project.category}</div></div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFeatured(project)} className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm">
                    {project.featured ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="w-4 h-4 text-white" />}
                  </button>
                  <button onClick={() => handleEdit(project)} className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"><Pencil className="w-4 h-4 text-white" /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 bg-black/50 hover:bg-destructive/80 rounded backdrop-blur-sm"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className={`h-16 sm:h-20 bg-gradient-to-r ${project.color}`} />
                <div className="absolute top-2 left-2"><div className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">{project.category}</div></div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFeatured(project)} className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm">
                    {project.featured ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="w-4 h-4 text-white" />}
                  </button>
                  <button onClick={() => handleEdit(project)} className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"><Pencil className="w-4 h-4 text-white" /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 bg-black/50 hover:bg-destructive/80 rounded backdrop-blur-sm"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
              </div>
            )}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-sm sm:text-base mb-1">{project.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.tags.split(",").map((tag) => <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded">{tag.trim()}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No projects yet. Add your first project!</p>
        </div>
      )}
    </div>
  );
}

// Messages Manager
function MessagesManager() {
  const { token, refresh, refreshKey } = useContext(AdminContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        console.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token, refreshKey]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      });
      refresh();
      if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, status });
    } catch {
      console.error("Failed to update status");
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedMessage.id, reply: replyText, status: "replied" }),
      });
      setReplyText("");
      refresh();
      setSelectedMessage({ ...selectedMessage, reply: replyText, status: "replied" });
    } catch {
      console.error("Failed to send reply");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setSelectedMessage(null);
      refresh();
    } catch {
      console.error("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;

  if (selectedMessage) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <button onClick={() => setSelectedMessage(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base">
          <ChevronDown className="w-4 h-4 rotate-90" /> Back to Messages
        </button>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg sm:text-xl font-bold mb-2">{selectedMessage.subject}</h2>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>From: {selectedMessage.name}</span>
              <span>{selectedMessage.email}</span>
              <span>{formatDate(selectedMessage.createdAt)}</span>
            </div>
          </div>
          <div className="p-4 sm:p-6"><p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{selectedMessage.message}</p></div>
          {selectedMessage.reply && (
            <div className="p-4 sm:p-6 bg-green-500/5 border-t border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base"><Reply className="w-4 h-4" /> Your Reply</h4>
              <p className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base">{selectedMessage.reply}</p>
            </div>
          )}
          <div className="p-4 sm:p-6 border-t border-border space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Reply to this message</label>
              <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply here..." rows={4} className="bg-muted border-border" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={sendReply} className="gap-2" disabled={!replyText.trim()}><Send className="w-4 h-4" /> Save Reply</Button>
              <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                <Mail className="w-4 h-4" /> Send via Email
              </a>
              <Button variant="destructive" onClick={() => deleteMessage(selectedMessage.id)} className="ml-auto"><Trash2 className="w-4 h-4" /> Delete</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{messages.filter((m) => m.status === "unread").length} unread messages</p>
      </div>
      <div className="space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => { setSelectedMessage(message); if (message.status === "unread") updateStatus(message.id, "read"); }}
            className={`p-3 sm:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border cursor-pointer hover:border-primary/50 transition-all ${message.status === "unread" ? "border-l-4 border-l-primary" : ""}`}
          >
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-1">
                  <h3 className="font-semibold truncate text-sm sm:text-base">{message.subject}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${message.status === "unread" ? "bg-yellow-500/10 text-yellow-500" : message.status === "replied" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>{message.status}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">From: <span className="text-foreground">{message.name}</span> ({message.email})</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{message.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {messages.length === 0 && <div className="text-center py-12"><Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No messages yet</p></div>}
    </div>
  );
}

// Settings Manager
function SettingsManager() {
  const { token } = useContext(AdminContext);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
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
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } catch {
      console.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;

  const settingGroups = [
    { title: "Profile Picture", fields: [{ key: "profileImage", label: "Profile Image", type: "image" }] },
    { title: "Site Information", fields: [{ key: "siteName", label: "Site Name" }, { key: "siteTagline", label: "Tagline" }, { key: "siteDescription", label: "Description", type: "textarea" }] },
    { title: "Personal Information", fields: [{ key: "ownerName", label: "Your Name" }, { key: "ownerRole", label: "Your Role" }] },
    { title: "Contact Information", fields: [{ key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "location", label: "Location" }, { key: "responseTime", label: "Response Time" }] },
    { title: "Social Links", fields: [{ key: "githubUrl", label: "GitHub URL" }, { key: "linkedinUrl", label: "LinkedIn URL" }, { key: "twitterUrl", label: "Twitter URL" }, { key: "facebookUrl", label: "Facebook URL" }] },
    { title: "Hero Section", fields: [{ key: "heroBadge", label: "Badge Text" }, { key: "heroTitle", label: "Title", type: "textarea" }, { key: "heroSubtitle", label: "Subtitle", type: "textarea" }] },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your site settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">{group.title}</h3>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  {field.type === "image" ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center ${settings[field.key] ? '' : 'border-dashed'}`}>
                          {settings[field.key] ? (
                            <img src={settings[field.key]} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                          )}
                        </div>
                        {settings[field.key] && (
                          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer p-2 bg-primary text-primary-foreground rounded-full">
                              <Pencil className="w-4 h-4" />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => setSettings({ ...settings, [field.key]: ev.target?.result as string });
                                  reader.readAsDataURL(file);
                                }
                              }} />
                            </label>
                          </div>
                        )}
                      </div>
                      {!settings[field.key] && (
                        <label className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                          Upload Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setSettings({ ...settings, [field.key]: ev.target?.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <>
                      <label className="text-sm font-medium">{field.label}</label>
                      <Textarea value={settings[field.key] || ""} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} rows={3} className="bg-muted border-border" />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium">{field.label}</label>
                      <Input value={settings[field.key] || ""} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className="bg-muted border-border" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple List Manager
function SimpleListManager({ title, apiPath, fields }: { title: string; apiPath: string; fields: { key: string; label: string; type?: string }[] }) {
  const { token, refresh, refreshKey } = useContext(AdminContext);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/${apiPath}`);
        const data = await res.json();
        setItems(data[apiPath] || data.items || []);
      } catch {
        console.error(`Failed to fetch ${apiPath}`);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [apiPath, refreshKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = editing ? { ...formData, id: editing.id } : formData;
      await fetch(`/api/${apiPath}`, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      setShowForm(false);
      setEditing(null);
      setFormData({});
      refresh();
    } catch {
      console.error(`Failed to save ${apiPath}`);
    }
  };

  const handleEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    const data: Record<string, string> = {};
    fields.forEach((f) => { data[f.key] = String(item[f.key] || ""); });
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/${apiPath}?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button onClick={() => { setEditing(null); setFormData({}); setShowForm(true); }} className="gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" /> Add</Button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card rounded-2xl border border-border p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">{editing ? "Edit" : "Add"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "textarea" ? (
                      <Textarea value={formData[field.key] || ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-muted border-border" />
                    ) : field.type === "number" ? (
                      <Input type="number" value={formData[field.key] || ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-muted border-border" />
                    ) : (
                      <Input value={formData[field.key] || ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-muted border-border" />
                    )}
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={String(item.id)} className="p-3 sm:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border flex items-center justify-between group">
            <div className="min-w-0">
              <h3 className="font-medium text-sm sm:text-base truncate">{String(item.title || item.name || item.platform || item.year)}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{String(item.description || item.url || item.category || "")}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-muted rounded"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(String(item.id))} className="p-2 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Admin Page
export default function NiuarnoAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const rememberedToken = getRememberedToken();
      if (rememberedToken && rememberedToken === ADMIN_TOKEN) {
        setToken(rememberedToken);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_TOKEN) {
      setToken(password);
      setIsAuthenticated(true);
      setError("");
      if (rememberDevice) saveRememberedToken(password);
    } else {
      setError("Invalid admin token");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    setPassword("");
    clearRememberedToken();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-white">N</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Enter admin token to access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 sm:p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />{error}
              </motion.div>
            )}
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Admin Token" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted border-border pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={rememberDevice} onChange={(e) => setRememberDevice(e.target.checked)} className="w-4 h-4 rounded border-border" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Remember this device for 30 days</label>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">Login</Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ token, setToken, refresh, refreshKey, setActiveTab }}>
      <div className="min-h-screen bg-background">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />
        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg"><Menu className="w-5 h-5" /></button>
              <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                <Button variant="outline" size="sm" onClick={refresh} className="gap-2 hidden sm:inline-flex"><RefreshCw className="w-4 h-4" /> Refresh</Button>
                <Button variant="outline" size="sm" onClick={refresh} className="sm:hidden p-2"><RefreshCw className="w-4 h-4" /></Button>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 hidden sm:inline-flex"><ExternalLink className="w-4 h-4" /> View Site</Button>
                  <Button variant="outline" size="sm" className="sm:hidden p-2"><ExternalLink className="w-4 h-4" /></Button>
                </a>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "site-activity" && <SiteActivity />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "messages" && <MessagesManager />}
            {activeTab === "settings" && <SettingsManager />}
            {activeTab === "services" && <SimpleListManager title="Services" apiPath="services" fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }, { key: "icon", label: "Icon Name" }, { key: "features", label: "Features", type: "textarea" }, { key: "color", label: "Color" }]} />}
            {activeTab === "skills" && <SimpleListManager title="Skills" apiPath="skills" fields={[{ key: "name", label: "Name" }, { key: "level", label: "Level (0-100)", type: "number" }, { key: "icon", label: "Icon Name" }, { key: "category", label: "Category" }]} />}
            {activeTab === "experience" && <SimpleListManager title="Experience Timeline" apiPath="experiences" fields={[{ key: "year", label: "Year" }, { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }]} />}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
