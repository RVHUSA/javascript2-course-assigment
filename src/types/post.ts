export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: { url: string };
}

export interface MediaItem {
  url: string;
  alt?: string;
}

export interface Post {
  id?: string;
  title: string;
  body: string;
  owner: User;
  published?: string;
  created?: string;
  media?: MediaItem | MediaItem[] | null;
}
