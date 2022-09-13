import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMSG";

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    //Verificar conecção com o Banco de Dados e encaminhar requisição, caso conectado.
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    //Caso não conectado, obter variável de ambiente.
    const { DB_CONEXAO_STRING } = process.env;

    //Caso env estiver vazia, informar o programador
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ erro: "ENV de configuração do banco não informada" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Banco de dados conectado")
    );
    mongoose.connection.on("error", (error) =>
      console.log("Ocorreu um erro ao conectar ao banco de dados")
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    //Seguir para o endpoint, pois a conecção com o banco de dados está garantida
    return handler(req, res);
  };
