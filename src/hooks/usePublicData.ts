// ─── Public-facing data hooks ─────────────────────────────────────────────────
// These hooks bridge the admin localStorage database with the public pages.
// If the admin has added/edited content it shows up here automatically.
// If the admin db is empty for a module, the static schoolData seed is used
// as a fallback so the site never shows blank sections on first load.

import { useState, useEffect } from 'react';
import { newsDB, galleryDB, downloadsDB, eventsDB } from '../admin/db';
import type { NewsItem, GalleryImage, DownloadItem, SchoolEvent } from '../admin/db';
import { latestNews as staticNews, upcomingEvents as staticEvents, downloads as staticDownloads } from '../data/schoolData';

// ── News ──────────────────────────────────────────────────────────────────────
// Returns only published articles. Falls back to static seed when the admin
// database is empty (i.e. no articles have been created yet).
export function usePublicNews() {
  const [items, setItems] = useState<NewsItem[]>(() => getPublishedNews());

  function getPublishedNews(): NewsItem[] {
    const adminNews = newsDB.list().filter(n => n.status === 'published');
    if (adminNews.length > 0) return adminNews;
    // Map static data shape → NewsItem shape so components work either way
    return staticNews.map(n => ({
      id: String(n.id),
      title: n.title,
      content: n.excerpt,
      excerpt: n.excerpt,
      category: n.category,
      author: 'Admin',
      date: n.date,
      status: 'published' as const,
      featured: false,
      imageBase64: n.image,   // static uses URL path, admin uses base64
      slug: n.slug,
    }));
  }

  // Re-read on focus (tab switch back) so admin changes appear without reload
  useEffect(() => {
    const handler = () => setItems(getPublishedNews());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return items;
}

// ── Gallery ───────────────────────────────────────────────────────────────────
// Returns all gallery images — public folder images are always included,
// with any admin-uploaded images appended after them.
export function usePublicGallery() {
  const [items, setItems] = useState<GalleryImage[]>(() => galleryDB.list());

  useEffect(() => {
    const handler = () => setItems(galleryDB.list());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return items;
}

// ── Downloads ─────────────────────────────────────────────────────────────────
// Merges admin downloads with the static list so the Downloads page is never
// empty, and admin-uploaded files appear at the top.
export function usePublicDownloads() {
  const [items, setItems] = useState<DownloadItem[]>(() => getDownloads());

  function getDownloads(): DownloadItem[] {
    const adminItems = downloadsDB.list();
    if (adminItems.length > 0) return adminItems;
    // Fallback to static downloads mapped to DownloadItem shape
    return staticDownloads.map(d => ({
      id: d.name,
      title: d.name,
      description: '',
      category: d.category as DownloadItem['category'],
      fileBase64: d.file,   // static uses URL path
      fileName: d.name,
      fileSize: d.size,
      fileType: 'application/pdf',
      downloads: 0,
      uploadedAt: '',
    }));
  }

  useEffect(() => {
    const handler = () => setItems(getDownloads());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return items;
}

// ── Events ────────────────────────────────────────────────────────────────────
// Returns admin events sorted by date. Falls back to static events.
export function usePublicEvents() {
  const [items, setItems] = useState<SchoolEvent[]>(() => getEvents());

  function getEvents(): SchoolEvent[] {
    const adminEvents = eventsDB.list();
    if (adminEvents.length > 0) {
      return [...adminEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    // Fallback to static upcoming events mapped to SchoolEvent shape
    return staticEvents.map(e => ({
      id: String(e.id),
      title: e.title,
      description: e.description,
      date: e.date,
      time: '09:00',
      location: '',
      organizer: '',
      posterBase64: '',
      category: e.type,
    }));
  }

  useEffect(() => {
    const handler = () => setItems(getEvents());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  // Upcoming = events from today onwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = items.filter(e => new Date(e.date) >= today);

  return { all: items, upcoming };
}
