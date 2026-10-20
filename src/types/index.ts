// src/types/index.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    rol: string;
  }
}
