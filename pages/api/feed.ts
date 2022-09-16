import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMSG";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const feedEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<any[] | RespostaPadraoMsg>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id);
        if (!usuario) {
          return res.status(405).json({ erro: "Usuário não encontrado" });
        }
        const publicacoes = await PublicacaoModel.find({
          idUsuario: usuario._id,
        }).sort({ data: -1 });

        return res.status(200).json(publicacoes);
      }
    }
    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
  }
  return res.status(400).json({ erro: "Não foi possivel obter o feed" });
};
export default validarTokenJWT(conectarMongoDB(feedEndpoint));