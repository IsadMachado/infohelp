import { Request } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { prisma } from "..";
import { router } from "./routes";

dotenv.config();

// Criar um novo usuário
router.post("/usuario", async (req: Request, res: any) => {
  let {
    nome,
    email,
    senha,
    tecnico = false,
    idade,
    zap,
    relacionamento,
  } = req.body;

  // Normaliza o email: remove espaços e converte para minúsculas
  email = email.trim().toLowerCase();

  try {
    // Verifica se o email já está cadastrado
    const emailExiste = await prisma.usuario.findUnique({
      where: { email },
    });

    if (emailExiste) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    // Criptografa a senha
    const salt = bcrypt.genSaltSync(10);
    const senhaCriptografada = bcrypt.hashSync(senha, salt);

    // Converte idade para número
    const idadeNumero = Number(idade);
    if (isNaN(idadeNumero) || idadeNumero <= 0) {
      return res
        .status(400)
        .json({ error: "Idade deve ser um número válido." });
    }

    // Cria o novo usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        tecnico,
        idade: idadeNumero,
        zap,
        relacionamento,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error: any) {
    // Verifica se o erro é devido a uma violação de restrição única
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    res
      .status(500)
      .json({ error: "Erro ao criar usuário.", details: error.message });
  }
});

// Listar todos os usuários
router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários.", details: error });
  }
});

// Buscar usuário por ID
router.get("/usuario/:id", async (req: Request, res: any) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário.", details: error });
  }
});

// Atualizar usuário
router.put("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tecnico } = req.body;

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id, 10) },
      data: { nome, email, senha, tecnico },
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao atualizar usuário.", details: error });
  }
});

// Deletar usuário
router.delete("/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar usuário.", details: error });
  }
});

router.get("/tecnicos", async (req: Request, res: any) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { tecnico: true },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários.", details: error });
  }
});
router.get("/tecnicos/:id", async (req: Request, res: any) => {
  const { id } = req.params;

  try {
    const usuarios = await prisma.usuario.findUnique({
      where: { id: parseInt(id, 10), tecnico: true },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários.", details: error });
  }
});

router.put("/bio/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  const { bio } = req.body;

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id, 10) },
      data: { bio },
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar bio.", details: error });
  }
});

export default router;
