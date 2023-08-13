export type User = {
  id: string;
  email: string;
  name: string;
  type: "ARTIST" | "PRODUCER" | "ENGINEER";
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  genre: string;
  name: string;
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  coverArtURL?: string;
};
