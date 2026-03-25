export interface Show {
  id: string;
  date: string;
  show_time: string | null;
  venue: string;
  city: string;
  state: string;
  ticket_url: string | null;
  description: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BandMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BandInfo {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover_image_url: string | null;
  year: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  album_id: string;
  title: string;
  track_number: number;
  audio_url: string;
  duration_seconds: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlbumWithTracks extends Album {
  tracks: Track[];
}
