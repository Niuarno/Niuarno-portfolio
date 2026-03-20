"use client";

import { useEffect, useRef } from "react";

export function VisitorTracker() {
  const sessionIdRef = useRef<string>("");
  const lastPageRef = useRef<string>("");
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("visitor_session_id", sessionId);
    }
    sessionIdRef.current = sessionId;

    // Define functions first
    async function trackVisitor(sid: string, page: string) {
      if (page === lastPageRef.current) return;
      lastPageRef.current = page;
      startTimeRef.current = Date.now();

      try {
        await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            page,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
            screenRes: `${screen.width}x${screen.height}`,
          }),
        });
      } catch {
        // Silent fail
      }
    }

    async function sendHeartbeat(sid: string) {
      try {
        await fetch("/api/visitors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            page: window.location.pathname,
          }),
        });
      } catch {
        // Silent fail
      }
    }

    async function updateDuration(sid: string) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      try {
        await fetch("/api/visitors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            duration,
          }),
        });
      } catch {
        // Silent fail
      }
    }

    // Track initial page view
    trackVisitor(sessionId, window.location.pathname);

    // Set up heartbeat
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat(sessionId);
    }, 30000); // Every 30 seconds

    // Track page duration on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateDuration(sessionId);
      }
    };

    // Track before unload
    const handleBeforeUnload = () => {
      updateDuration(sessionId);
      navigator.sendBeacon("/api/visitors", JSON.stringify({
        method: "PATCH",
        sessionId,
        isOnline: false,
      }));
    };

    // Track page changes (for SPA navigation)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      updateDuration(sessionId);
      originalPushState.apply(history, args);
      trackVisitor(sessionId, window.location.pathname);
    };

    const handlePopState = () => {
      updateDuration(sessionId);
      trackVisitor(sessionId, window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      history.pushState = originalPushState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
