import { CreateFuncionarioProps, FuncionarioProps } from "../../@types/Funcionario";
import { FuncionariosRepository } from "../interfaces/funcionarios-interfaces";
import knex from '../../../database'
import { v4 as uuid } from 'uuid'

export class KnexFuncionarioRepository implements FuncionariosRepository {

    async createFuncionario(data: CreateFuncionarioProps): Promise<FuncionarioProps | null> {
        const { nome, sobrenome, cargo, cpf } = data

        try {
            const id = uuid()

            const res: FuncionarioProps = await knex.transaction(async (trx) => {
                await trx
                    .insert({
                        id,
                        nome,
                        sobrenome,
                        cargo,
                        cpf
                    })
                    .into('funcionarios')

                const funcionario = await trx
                    .select()
                    .from('funcionarios')
                    .where({ id })

                return funcionario[0]
            })

            return res
        } catch {
            return null
        }
    }

    async getFuncionarioById(id: string): Promise<FuncionarioProps | null> {
        try {
            const funcionario: FuncionarioProps[] = await knex
                .select()
                .from('funcionarios')
                .where({ id })

            return funcionario[0]
        } catch {
            return null
        }
    }

    async getFuncionarioByCpf(cpf: string): Promise<FuncionarioProps | null> {
        try {
            const funcionario: FuncionarioProps[] = await knex
                .select()
                .from('funcionarios')
                .where({ cpf })

            return funcionario[0]
        } catch {
            return null
        }
    }

    async updateFuncionario(data: FuncionarioProps): Promise<FuncionarioProps | null> {
        try {
            const { id, nome, sobrenome, cargo, cpf, status_func } = data

            const res = await knex
                .update({
                    nome,
                    sobrenome,
                    cargo,
                    cpf,
                    status_func
                })
                .where({ id })

            return res
        } catch {
            return null
        }
    }

}

