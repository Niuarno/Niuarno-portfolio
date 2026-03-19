"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
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
  Reply,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Briefcase,
  Code,
  Calendar,
  Link2,
  ExternalLink,
  Send,
  Star,
  StarOff,
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
  createdAt: string;
}

interface Settings {
  [key: string]: string;
}

// Context
const AdminContext = createContext<{
  token: string;
  setToken: (t: string) => void;
  refresh: () => void;
  refreshKey: number;
}>({
  token: "",
  setToken: () => {},
  refresh: () => {},
  refreshKey: 0,
});

const ADMIN_TOKEN = "niuarno-admin-2024";

// Sidebar Component
function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  onLogout 
}: { 
  activeTab: string; 
  setActiveTab: (t: string) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  onLogout: () => void;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 lg:translate-x-0 lg:!translate-x-0"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <div>
                <h1 className="font-bold">Niuarno Admin</h1>
                <p className="text-xs text-muted-foreground">Content Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Only close sidebar on mobile
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// Dashboard Component
function Dashboard() {
  const { token, refreshKey } = useContext(AdminContext);
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const projectsData = await projectsRes.json();
        const messagesData = await messagesRes.json();

        setStats({
          projects: projectsData.projects?.length || 0,
          messages: messagesData.messages?.length || 0,
          unread: messagesData.messages?.filter((m: Message) => m.status === "unread").length || 0,
        });
      } catch {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, refreshKey]);

  const statCards = [
    { label: "Total Projects", value: stats.projects, icon: FolderKanban, color: "from-cyan-500 to-blue-500" },
    { label: "Total Messages", value: stats.messages, icon: Mail, color: "from-purple-500 to-pink-500" },
    { label: "Unread Messages", value: stats.unread, icon: AlertCircle, color: "from-orange-500 to-red-500" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/admin#/projects" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </a>
          <a href="/admin#/messages" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
            <Mail className="w-4 h-4" /> View Messages
          </a>
          <a href="/admin#/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
            <Settings className="w-4 h-4" /> Edit Settings
          </a>
          <a href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
        </div>
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUpload({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (base64: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <img 
            src={value} 
            alt="Project preview" 
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP (max 5MB)</p>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

// Projects Management Component
function ProjectsManager() {
  const { token, refresh, refreshKey } = useContext(AdminContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WordPress",
    tags: "",
    image: "",
    link: "",
    github: "",
    color: "from-cyan-500 to-blue-500",
    featured: false,
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setFormData({
          title: "",
          description: "",
          category: "WordPress",
          tags: "",
          image: "",
          link: "",
          github: "",
          color: "from-cyan-500 to-blue-500",
          featured: false,
        });
        refresh();
      }
    } catch {
      console.error("Failed to save project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      image: project.image || "",
      link: project.link || "",
      github: project.github || "",
      color: project.color,
      featured: project.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) refresh();
    } catch {
      console.error("Failed to delete project");
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: project.id, featured: !project.featured }),
      });
      refresh();
    } catch {
      console.error("Failed to update project");
    }
  };

  const colorOptions = [
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              title: "",
              description: "",
              category: "WordPress",
              tags: "",
              image: "",
              link: "",
              github: "",
              color: "from-cyan-500 to-blue-500",
              featured: false,
            });
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-card rounded-2xl border border-border p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-6">
                {editing ? "Edit Project" : "Add New Project"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md"
                    >
                      <option value="WordPress">WordPress</option>
                      <option value="Wix">Wix</option>
                      <option value="Shopify">Shopify</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-muted border-border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="WordPress, E-commerce, Custom"
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} ${
                            formData.color === color ? "ring-2 ring-primary ring-offset-2" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Image</label>
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(base64) => setFormData({ ...formData, image: base64 })} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project URL</label>
                    <Input
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://..."
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm">Featured Project</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 gap-2">
                    <Save className="w-4 h-4" /> {editing ? "Update" : "Create"} Project
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border group overflow-hidden"
          >
            {project.image && (
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>
                    {project.category}
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(project)}
                    className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"
                    title={project.featured ? "Remove from featured" : "Add to featured"}
                  >
                    {project.featured ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 bg-black/50 hover:bg-destructive/80 rounded backdrop-blur-sm"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
            {!project.image && (
              <div className="relative">
                <div className={`h-20 bg-gradient-to-r ${project.color}`} />
                <div className="absolute top-2 left-2">
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                    {project.category}
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(project)}
                    className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"
                    title={project.featured ? "Remove from featured" : "Add to featured"}
                  >
                    {project.featured ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 bg-black/50 hover:bg-black/70 rounded backdrop-blur-sm"
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 bg-black/50 hover:bg-destructive/80 rounded backdrop-blur-sm"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.tags.split(",").map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded">
                    {tag.trim()}
                  </span>
                ))}
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

// Messages Management Component
function MessagesManager() {
  const { token, refresh, refreshKey } = useContext(AdminContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      refresh();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedMessage(null);
      refresh();
    } catch {
      console.error("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // Message Detail View
  if (selectedMessage) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMessage(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90" /> Back to Messages
        </button>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>From: {selectedMessage.name}</span>
                  <span>•</span>
                  <span>{selectedMessage.email}</span>
                  <span>•</span>
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedMessage.status === "unread" ? "bg-yellow-500/10 text-yellow-500" :
                  selectedMessage.status === "replied" ? "bg-green-500/10 text-green-500" :
                  "bg-blue-500/10 text-blue-500"
                }`}>
                  {selectedMessage.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
          </div>

          {selectedMessage.reply && (
            <div className="p-6 bg-green-500/5 border-t border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Reply className="w-4 h-4" /> Your Reply
              </h4>
              <p className="whitespace-pre-wrap text-muted-foreground">{selectedMessage.reply}</p>
            </div>
          )}

          <div className="p-6 border-t border-border space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Reply to this message</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={4}
                className="bg-muted border-border"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={sendReply} className="gap-2" disabled={!replyText.trim()}>
                <Send className="w-4 h-4" /> Save Reply
              </Button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Mail className="w-4 h-4" /> Send via Email
              </a>
              <Button
                variant="outline"
                onClick={() => updateStatus(selectedMessage.id, "read")}
                disabled={selectedMessage.status === "read"}
              >
                <Eye className="w-4 h-4 mr-2" /> Mark as Read
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMessage(selectedMessage.id)}
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Messages List
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">
          {messages.filter((m) => m.status === "unread").length} unread messages
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setSelectedMessage(message);
              if (message.status === "unread") {
                updateStatus(message.id, "read");
              }
            }}
            className={`p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/50 transition-all ${
              message.status === "unread" ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold truncate">{message.subject}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    message.status === "unread" ? "bg-yellow-500/10 text-yellow-500" :
                    message.status === "replied" ? "bg-green-500/10 text-green-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  From: <span className="text-foreground">{message.name}</span> ({message.email})
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(message.createdAt)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      )}
    </div>
  );
}

// Settings Manager Component
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      console.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const settingGroups = [
    {
      title: "Site Information",
      fields: [
        { key: "siteName", label: "Site Name" },
        { key: "siteTagline", label: "Tagline" },
        { key: "siteDescription", label: "Description", type: "textarea" },
      ],
    },
    {
      title: "Personal Information",
      fields: [
        { key: "ownerName", label: "Your Name" },
        { key: "ownerRole", label: "Your Role" },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "location", label: "Location" },
        { key: "responseTime", label: "Response Time" },
      ],
    },
    {
      title: "Social Links",
      fields: [
        { key: "githubUrl", label: "GitHub URL" },
        { key: "linkedinUrl", label: "LinkedIn URL" },
        { key: "twitterUrl", label: "Twitter URL" },
      ],
    },
    {
      title: "Hero Section",
      fields: [
        { key: "heroBadge", label: "Badge Text" },
        { key: "heroTitle", label: "Title", type: "textarea" },
        { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your site settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-4">{group.title}</h3>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      rows={3}
                      className="bg-muted border-border"
                    />
                  ) : (
                    <Input
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="bg-muted border-border"
                    />
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

// Simple list managers for Services, Skills, Experience
function SimpleListManager({ 
  title, 
  apiPath, 
  fields 
}: { 
  title: string; 
  apiPath: string; 
  fields: { key: string; label: string; type?: string }[];
}) {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    fields.forEach((f) => {
      data[f.key] = String(item[f.key] || "");
    });
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/${apiPath}?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({});
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-xl font-bold mb-4">{editing ? "Edit" : "Add"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="bg-muted border-border"
                      />
                    ) : field.type === "number" ? (
                      <Input
                        type="number"
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="bg-muted border-border"
                      />
                    ) : (
                      <Input
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="bg-muted border-border"
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-3">
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
          <div
            key={String(item.id)}
            className="p-4 rounded-xl bg-card border border-border flex items-center justify-between group"
          >
            <div>
              <h3 className="font-medium">{String(item.title || item.name || item.platform || item.year)}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {String(item.description || item.url || item.category || "")}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-muted rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(String(item.id))} className="p-2 hover:bg-destructive/10 rounded">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Admin Page
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_TOKEN) {
      setToken(password);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin token");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    setPassword("");
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Enter admin token to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Input
              type="password"
              placeholder="Admin Token"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border"
            />

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
              Login
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Default token: <code className="text-primary">niuarno-admin-2024</code>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ token, setToken, refresh, refreshKey }}>
      <div className="min-h-screen bg-background">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 ml-auto">
                <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" /> View Site
                  </Button>
                </a>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "messages" && <MessagesManager />}
            {activeTab === "settings" && <SettingsManager />}
            {activeTab === "services" && (
              <SimpleListManager
                title="Services"
                apiPath="services"
                fields={[
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", type: "textarea" },
                  { key: "icon", label: "Icon Name (Lucide)" },
                  { key: "features", label: "Features (comma separated)", type: "textarea" },
                  { key: "color", label: "Color Gradient" },
                ]}
              />
            )}
            {activeTab === "skills" && (
              <SimpleListManager
                title="Skills"
                apiPath="skills"
                fields={[
                  { key: "name", label: "Name" },
                  { key: "level", label: "Level (0-100)", type: "number" },
                  { key: "icon", label: "Icon Name" },
                  { key: "category", label: "Category" },
                ]}
              />
            )}
            {activeTab === "experience" && (
              <SimpleListManager
                title="Experience Timeline"
                apiPath="experiences"
                fields={[
                  { key: "year", label: "Year" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", type: "textarea" },
                ]}
              />
            )}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
