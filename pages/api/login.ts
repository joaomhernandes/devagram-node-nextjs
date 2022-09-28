import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMSG";
import type { LoginResposta } from "../../types/LoginResposta";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from "jsonwebtoken";
import { politicaCORS } from "../../middlewares/politicaCORS";

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
  const { MINHA_CHAVE_JWT } = process.env;
  if (!MINHA_CHAVE_JWT) {
    return res.status(500).json({ erro: "ENV Jwt não informada" });
  }
  if (req.method == "POST") {
    const { login, senha } = req.body;

    const usuariosEncontrados = await UsuarioModel.find({
      email: login,
      senha: md5(senha),
    });
    if (usuariosEncontrados && usuariosEncontrados.length > 0) {
      const usuarioEcontrado = usuariosEncontrados[0];
      const token = jwt.sign({ _id: usuarioEcontrado }, MINHA_CHAVE_JWT);

      return res.status(200).json({
        nome: usuarioEcontrado.nome,
        email: usuarioEcontrado.email,
        token,
      });
    }
    return res.status(400).json({ erro: "Usuário ou senha não encontrado" });
  }
  return res.status(405).json({ erro: "Método informado não válido" });
};

export default politicaCORS(conectarMongoDB(endpointLogin));
