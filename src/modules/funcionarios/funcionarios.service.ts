import { AppError } from "../../lib/AppError";
import { PG, isPgError } from "../../lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { criarFuncionarioSchema, atualizarFuncionarioSchema } from "./funcionarios.schema";
import { funcionariosRepository } from "./funcionarios.repository";

type CriarDto = z.infer<typeof criarFuncionarioSchema>;
type AtualizarDto = z.infer<typeof atualizarFuncionarioSchema>;

export const funcionariosService = {
  async criar(data: CriarDto) {
    const { email, senha, data_admissao, ...funcionarioData } = data;

    let novoUsuario: { email: string; senha_hash: string } | undefined;
    if (email && senha) {
      if (await funcionariosRepository.emailUsuarioExiste(email)) {
        throw new AppError("E-mail já cadastrado", 409);
      }
      novoUsuario = { email, senha_hash: await bcrypt.hash(senha, 10) };
    }

    try {
      return await funcionariosRepository.criar(
        {
          ...funcionarioData,
          data_admissao: data_admissao ? new Date(data_admissao) : null,
        },
        novoUsuario
      );
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("E-mail já cadastrado", 409);
      }
      throw error;
    }
  },

  async listar() {
    return funcionariosRepository.listar();
  },

  async buscarPorId(id: string) {
    const funcionario = await funcionariosRepository.buscarPorId(id);
    if (!funcionario) throw new AppError("Funcionário não encontrado", 404);
    return funcionario;
  },

  async atualizar(id: string, data: AtualizarDto) {
    await this.buscarPorId(id);
    const { data_admissao, ...rest } = data;
    return funcionariosRepository.atualizar(id, {
      ...rest,
      ...(data_admissao !== undefined && {
        data_admissao: data_admissao ? new Date(data_admissao) : null,
      }),
    });
  },
};
