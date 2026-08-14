import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import {
  identificarConcurso,
  gerarPlanoEstudos,
  gerarQuestoes,
  gerarFlashcards,
  chatComMentor,
} from "./server/geminiService.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// 1. Identificar Concurso e Banca (Etapa 2)
app.post("/api/concurso/identificar", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Termo de busca do concurso é obrigatório." });
    }

    const result = await identificarConcurso(query);
    res.json(result);
  } catch (error: any) {
    console.error("Erro ao identificar concurso:", error);
    res.status(500).json({
      error: error.message || "Erro interno ao processar a busca do concurso.",
    });
  }
});

// 2. Busca de Edital e Geração do Estudo Planejado (Etapa 3 & 4)
app.post("/api/concurso/gerar-plano", async (req, res) => {
  try {
    const { concurso, cargo, banca, ano, horasDiarias = 2, horasSemana, nivelAtual } = req.body;
    if (!concurso) {
      return res.status(400).json({ error: "Nome do concurso é obrigatório." });
    }

    const result = await gerarPlanoEstudos({
      concurso,
      cargo,
      banca,
      ano,
      horasDiarias,
      horasSemana,
      nivelAtual,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Erro ao gerar plano de estudos:", error);
    res.status(500).json({
      error: error.message || "Erro interno ao gerar o plano de estudos do edital.",
    });
  }
});

// 3. Gerador de Questões Comentadas da Banca
app.post("/api/concurso/gerar-questoes", async (req, res) => {
  try {
    const { disciplina, topico, banca, concurso, quantidade = 3 } = req.body;
    const result = await gerarQuestoes({ disciplina, topico, banca, concurso, quantidade });
    res.json(result);
  } catch (error: any) {
    console.error("Erro ao gerar questões:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar questões de estudo." });
  }
});

// 4. Gerador de Flashcards Inteligentes
app.post("/api/concurso/gerar-flashcards", async (req, res) => {
  try {
    const { disciplina, topicos, banca } = req.body;
    const result = await gerarFlashcards({ disciplina, topicos, banca });
    res.json(result);
  } catch (error: any) {
    console.error("Erro ao gerar flashcards:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar flashcards." });
  }
});

// 5. Chat com Mentor IA Especialista em Concursos
app.post("/api/concurso/mentor-chat", async (req, res) => {
  try {
    const { messages, concursoContexto } = req.body;
    const result = await chatComMentor(messages, concursoContexto);
    res.json(result);
  } catch (error: any) {
    console.error("Erro no chat do mentor:", error);
    res.status(500).json({ error: error.message || "Erro ao comunicar com o Mentor IA." });
  }
});

// Setup Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ConcursoMentor AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
