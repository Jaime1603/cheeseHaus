/** @jest-environment node */
import { authenticateCredentials } from "@/services/authService";
import { findCredentialByEmail } from "@/repositories/authRepository";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
    __esModule: true,
    default: { compare: jest.fn() },
}));
jest.mock("@/repositories/authRepository", () => ({
    findCredentialByEmail: jest.fn(),
    updateLastAccess: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test("rechaza si el correo no está registrado", async () => {
    (findCredentialByEmail as jest.Mock).mockResolvedValue(null);

    const resultado = await authenticateCredentials("nadie@correo.com", "clave123");

    expect(resultado).toBeNull();
});

test("Rechaza si hay campos vacios", async () => {
    const resultado = await authenticateCredentials("", "clave123");

    expect(resultado).toBeNull();
    expect(findCredentialByEmail).not.toHaveBeenCalled();
});
test("rechaza si el correo esta inactivo", async () => {
    (findCredentialByEmail as jest.Mock).mockResolvedValue({ activo: false });

    const resultado = await authenticateCredentials("nadie@correo.com", "clave123");

    expect(resultado).toBeNull();
});
test("Rechaza si el campo no es texto", async () => {
    const resultado = await authenticateCredentials(123, "clave123");

    expect(resultado).toBeNull();

});
test("rechaza si la contraseña es incorrecta", async () => {
    (findCredentialByEmail as jest.Mock).mockResolvedValue({
        activo: true,
        password_hash: "hash-guardado",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // "la clave no coincide"

    const resultado = await authenticateCredentials("ana@correo.com", "mala");

    expect(resultado).toBeNull();
});
test("devuelve el usuario con credenciales validas", async () => {
    (findCredentialByEmail as jest.Mock).mockResolvedValue({

        id: 7,
        activo: true,
        email: "ana@correo.com",
        password_hash: "hash-guardado",
        rol: "Cliente",
        cliente: { id_cliente: 3, nombre: "Ana", apellido: "Perez" }

    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const resultado = await authenticateCredentials("ana@correo.com", "clave123");

    expect(resultado).toEqual({
        id: "3",
        email: "ana@correo.com",
        name: "Ana Perez",
        rol: "Cliente"

    });
});