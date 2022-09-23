import mongoose, { Schema } from "mongoose";

const SeguidorSchema = new Schema({
  usuarioId: { type: String, required: true },
  usuarioSeguidoId: { type: String, require: true },
});

export const SeguidorModel =
  mongoose.models.seguidores || mongoose.model("seguidores", SeguidorSchema);
