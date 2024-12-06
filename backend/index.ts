import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import router from "./routes/userRoutes";

const app = express();
export const prisma = new PrismaClient();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Fechar a conexão do Prisma quando o servidor for encerrado
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
