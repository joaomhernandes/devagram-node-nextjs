import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMSG";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";

const pesquisaEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
        if (!usuarioEncontrado) {
          return res.status(400).json({
            erro: "Usuário não encontrado",
          });
        }
        usuarioEncontrado.senha = null;
        return res.status(200).json(usuarioEncontrado);
      } else {
        const { filtro } = req.query;
        if (!filtro || filtro.length < 2) {
          return res.status(400).json({
            erro: "Favor informar pelo menos 2 caracteres para a busca",
          });
        }

        const usuariosEncontrados = await UsuarioModel.find({
          $or: [
            { nome: { $regex: filtro, $options: "i" } },
            { email: { $regex: filtro, $options: "i" } },
          ],
        });
        usuariosEncontrados.forEach((userFound) => {
          userFound.senha = null;
        });
        return res.status(200).json(usuariosEncontrados);
      }
    }
    return res.status(405).json({ erro: "Metodo informado não é valido" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro: "Não foi possivel buscar usuário" });
  }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
