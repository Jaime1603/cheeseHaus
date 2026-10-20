import {
  authenticateCredentials,
  type AuthenticatedUser,
} from "@/services/authService";

export const authController = {
  login(email: unknown, password: unknown): Promise<AuthenticatedUser | null> {
    return authenticateCredentials(email, password);
  },
};
