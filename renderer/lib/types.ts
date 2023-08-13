export type User = {
  id: string;
  email: string;
  name: string;
  type: "ARTIST" | "PRODUCER" | "ENGINEER";
  createdAt: Date;
  updatedAt: Date;
};
