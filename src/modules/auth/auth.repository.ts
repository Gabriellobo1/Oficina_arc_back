import { db } from "../../lib/db";

export type UsuarioRow = {
  id: string;
  email: string;
  senha_hash: string;
  perfil: string;
  criadoEm: Date;
};

export const authRepository = {
  async buscarUsuarioPorEmail(email: string) {
    const { rows } = await db.query<UsuarioRow>(
      `SELECT * FROM "Usuario" WHERE email = $1`,
      [email]
    );
    return rows[0] ?? null;
  },
};
