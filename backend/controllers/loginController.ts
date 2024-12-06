// src/controllers/loginController.ts

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { prisma } from "..";

dotenv.config();

export async function loginUsuario(req: Request, res: Response) {
  const { email, senha } = req.body;

  const mensagemErroPadrao = "Erro... Login ou Senha Inválidos";

  if (!email || !senha) {
    res.status(400).json({ erro: mensagemErroPadrao });
    return;
  }

  try {
    // Normaliza o email: remove espaços e converte para minúsculas
    const emailNormalizado = email.trim().toLowerCase();

    console.log(`Tentativa de login para o email: ${emailNormalizado}`);

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      console.log("Usuário não encontrado.");
      res.status(401).json({ erro: "Esse usuário não existe." });
      return;
    }

    // Verifica a senha de forma assíncrona
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      console.log("Senha inválida.");
      res.status(401).json({ erro: mensagemErroPadrao });
      return;
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        usuario_logado_id: usuario.id,
        usuario_logado_tecnico: usuario.tecnico,
      },
      process.env.JWT_KEY as string,
      { expiresIn: "1h" } // Define a expiração do token
    );

    console.log("Token JWT gerado com sucesso.");

    res.status(200).json({
      msg: "Logado com sucesso.",
      token,
      id: usuario.id,
      tecnico: usuario.tecnico,
    });
  } catch (error: any) {
    console.error("Erro no loginUsuario:", error);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
}
