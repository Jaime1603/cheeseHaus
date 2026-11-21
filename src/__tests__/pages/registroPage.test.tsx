import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistroPage from "@/app/(auth)/registro/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegistroPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  test("renderiza el formulario de registro y sus campos", () => {
    render(<RegistroPage />);

    expect(screen.getByRole("heading", { name: "Registrarse" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombres")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Apellidos")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrarme" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inicia Sesión" })).toHaveAttribute("href", "/login");
  });

  test("registra al usuario exitosamente y redirige a '/login'", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id_cliente: 1, email: "nuevo@correo.com" }),
    } as unknown as Response);

    render(<RegistroPage />);

    fireEvent.change(screen.getByPlaceholderText("Nombres"), { target: { value: "Carlos" } });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), { target: { value: "Gómez" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "carlos@correo.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "Clave123*" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrarme" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  test("muestra mensaje de error si la API responde con fallo", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: "El email ya está registrado" }),
    } as unknown as Response);

    render(<RegistroPage />);

    fireEvent.change(screen.getByPlaceholderText("Nombres"), { target: { value: "Carlos" } });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), { target: { value: "Gómez" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "carlos@correo.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "Clave123*" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrarme" }));

    await waitFor(() => {
      expect(screen.getByText("El email ya está registrado")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("muestra 'Error de conexión' si ocurre una excepción de red", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

    render(<RegistroPage />);

    fireEvent.change(screen.getByPlaceholderText("Nombres"), { target: { value: "Carlos" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "carlos@correo.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Registrarme" }));

    await waitFor(() => {
      expect(screen.getByText("Error de conexión")).toBeInTheDocument();
    });
  });
});
