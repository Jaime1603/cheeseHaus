/** @jest-environment node */
import { authController } from "@/controllers/authController";
import * as authService from "@/services/authService";

jest.mock("@/services/authService", () => ({
  authenticateCredentials: jest.fn(),
}));

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("llama a authenticateCredentials y devuelve el usuario autenticado", async () => {
    const mockUser = {
      id: "1",
      email: "test@correo.com",
      name: "Test User",
      rol: "CLIENTE",
    };
    (authService.authenticateCredentials as jest.Mock).mockResolvedValue(mockUser);

    const resultado = await authController.login("test@correo.com", "clave123");
    expect(authService.authenticateCredentials).toHaveBeenCalledWith("test@correo.com", "clave123");
    expect(resultado).toEqual(mockUser);
  });

  test("devuelve null si authenticateCredentials falla", async () => {
    (authService.authenticateCredentials as jest.Mock).mockResolvedValue(null);

    const resultado = await authController.login("invalido@correo.com", "mala");
    expect(resultado).toBeNull();
  });
});
