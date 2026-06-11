import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type FuncionarioData = {
  nome: string;
  cargo: string;
  especialidade?: string;
  salario: number;
  telefone?: string;
  data_admissao?: Date | null;
  ativo: boolean;
};

type NovoUsuario = { email: string; senha_hash: string };

// Mapeia uma linha do JOIN funcionário+usuário para o formato com `usuario` aninhado.
function mapFuncionario(row: Record<string, unknown>) {
  const { usuario_email, usuario_perfil, ...funcionario } = row;
  return {
    ...funcionario,
    usuario: usuario_email ? { email: usuario_email, perfil: usuario_perfil } : null,
  };
}

const SELECT_BASE = `
  SELECT f.*, u.email AS usuario_email, u.perfil AS usuario_perfil
  FROM "Funcionario" f
  LEFT JOIN "Usuario" u ON u.id = f."usuarioId"
`;

export const funcionariosRepository = {
  async emailUsuarioExiste(email: string) {
    const { rows } = await db.query(`SELECT 1 FROM "Usuario" WHERE email = $1`, [email]);
    return rows.length > 0;
  },

  async criar(data: FuncionarioData, novoUsuario?: NovoUsuario) {
    return db.withTransaction(async (tx) => {
      let usuarioId: string | null = null;
      let usuario: { email: string; perfil: string } | null = null;

      if (novoUsuario) {
        const { rows } = await tx(
          `INSERT INTO "Usuario" (email, senha_hash, perfil)
           VALUES ($1, $2, 'ATENDENTE')
           RETURNING id, email, perfil`,
          [novoUsuario.email, novoUsuario.senha_hash]
        );
        usuarioId = rows[0].id;
        usuario = { email: rows[0].email, perfil: rows[0].perfil };
      }

      const { rows } = await tx(
        `INSERT INTO "Funcionario"
           (nome, cargo, especialidade, salario, telefone, data_admissao, ativo, "usuarioId")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          data.nome,
          data.cargo,
          data.especialidade ?? null,
          data.salario,
          data.telefone ?? null,
          data.data_admissao ?? null,
          data.ativo,
          usuarioId,
        ]
      );

      return { ...rows[0], usuario };
    });
  },

  async listar() {
    const { rows } = await db.query(`${SELECT_BASE} ORDER BY f.nome ASC`);
    return rows.map(mapFuncionario);
  },

  async buscarPorId(id: string) {
    const { rows } = await db.query(`${SELECT_BASE} WHERE f.id = $1`, [id]);
    return rows[0] ? mapFuncionario(rows[0]) : null;
  },

  async atualizar(id: string, data: Record<string, unknown>) {
    const { clause, values, nextIndex, isEmpty } = buildUpdateSet(data);
    if (!isEmpty) {
      await db.query(`UPDATE "Funcionario" SET ${clause} WHERE id = $${nextIndex}`, [...values, id]);
    }
    return this.buscarPorId(id);
  },
};
