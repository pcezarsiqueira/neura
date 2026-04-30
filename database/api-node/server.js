// =====================================================================
// Exemplo de API HTTP (Node.js + Express + MySQL2) para rodar no seu VPS.
// Atende os endpoints esperados pelo driver httpDriver do front-end.
//
// Instalação no VPS:
//   mkdir neura-api && cd neura-api
//   npm init -y
//   npm install express mysql2 cors
//   cp mysql-api.example.js index.js
//   # configure as variáveis de ambiente DB_*, API_KEY, PORT
//   node index.js
//
// (Recomendado rodar atrás de Nginx + PM2/systemd + HTTPS.)
// =====================================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "neura",
  DB_PASSWORD = "",
  DB_NAME = "neura_corp",
  API_KEY = "",
  PORT = "3001",
  CORS_ORIGIN = "*",
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Auth opcional via header x-api-key
app.use((req, res, next) => {
  if (!API_KEY) return next();
  if (req.headers["x-api-key"] !== API_KEY) return res.status(401).json({ error: "unauthorized" });
  next();
});

const DIM_KEYS = [
  "alinhamento", "diagnostico", "design", "engajamento", "transferencia",
  "medicao", "comunicacao", "cultura", "transformacao",
];

function rowToRecord(row) {
  return {
    id: String(row.id),
    ts: new Date(row.created_at).getTime(),
    org: {
      nome: row.nome, cargo: row.cargo, empresa: row.empresa, setor: row.setor,
      colaboradores: row.colaboradores, whatsapp: row.whatsapp, email: row.email,
      consent: !!row.consent,
    },
    answers: typeof row.answers_json === "string" ? JSON.parse(row.answers_json) : row.answers_json,
    scores:  typeof row.scores_json  === "string" ? JSON.parse(row.scores_json)  : row.scores_json,
    overallPercent: row.overall_percent,
  };
}

// POST /diagnostics — cria
app.post("/diagnostics", async (req, res) => {
  try {
    const { ts, org, answers, scores, overallPercent } = req.body;
    const byKey = Object.fromEntries((scores || []).map((s) => [s.key, s.percent]));
    const cols = DIM_KEYS.map((k) => byKey[k] ?? 0);

    const [result] = await pool.execute(
      `INSERT INTO diagnostics
        (created_at, nome, cargo, empresa, setor, colaboradores, whatsapp, email, consent,
         overall_percent,
         score_alinhamento, score_diagnostico, score_design, score_engajamento,
         score_transferencia, score_medicao, score_comunicacao, score_cultura, score_transformacao,
         answers_json, scores_json)
       VALUES (FROM_UNIXTIME(?/1000), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ts || Date.now(),
        org.nome, org.cargo, org.empresa, org.setor,
        org.colaboradores, org.whatsapp, org.email, org.consent ? 1 : 0,
        overallPercent,
        ...cols,
        JSON.stringify(answers), JSON.stringify(scores),
      ],
    );

    const [rows] = await pool.execute(`SELECT * FROM diagnostics WHERE id = ?`, [result.insertId]);
    res.json(rowToRecord(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "save_failed" });
  }
});

// GET /diagnostics — lista
app.get("/diagnostics", async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM diagnostics ORDER BY created_at DESC`);
    res.json(rows.map(rowToRecord));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "list_failed" });
  }
});

// DELETE /diagnostics/:id
app.delete("/diagnostics/:id", async (req, res) => {
  try {
    await pool.execute(`DELETE FROM diagnostics WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "remove_failed" });
  }
});

// DELETE /diagnostics — limpa tudo
app.delete("/diagnostics", async (_req, res) => {
  try {
    await pool.query(`TRUNCATE TABLE diagnostics`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "clear_failed" });
  }
});

app.listen(Number(PORT), () => console.log(`NEURA API on :${PORT} (driver=mysql)`));
