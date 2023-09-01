export type User = {
  id: string;
  email: string;
  name: string;
  type: "ARTIST" | "PRODUCER" | "ENGINEER";
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  genre: string;
  name: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  coverArtURL?: string;
};

export type Branch = {
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
};

export type Version = {
  createdAt: string;
  updatedAt: string;
  name: string;
  tags: string[];
  description?: string;
  filesURL?: string;
  filesStoragePath?: string;
};

export type Preview = {
  id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  storagePath?: string;
  fileURL?: string;
};
