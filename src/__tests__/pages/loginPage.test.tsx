import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  test("renderiza el formulario de login y sus campos", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Iniciar Sesión" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registrarme" })).toHaveAttribute("href", "/registro");
  });

  test("muestra error cuando los campos están vacíos", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);
    const boton = screen.getByRole("button", { name: "Iniciar Sesión" });

    fireEvent.click(boton);

    await waitFor(() => {
      expect(
        screen.getByText("El correo electrónico y la contraseña son obligatorios"),
      ).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("muestra error cuando signIn devuelve error de credenciales", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "CredentialsSignin" });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "clave123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => {
      expect(screen.getByText("Email o contraseña incorrecta")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("inicia sesión exitosamente como CLIENTE y redirige a '/'", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({
      user: { email: "cliente@correo.com", rol: "CLIENTE" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "cliente@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "clave123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("inicia sesión exitosamente como ADMIN y redirige a '/admin'", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({
      user: { email: "admin@correo.com", rol: "ADMIN" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  test("muestra error de conexión si ocurre una excepción", async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "clave123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => {
      expect(screen.getByText("Error de conexión")).toBeInTheDocument();
    });
  });
});
