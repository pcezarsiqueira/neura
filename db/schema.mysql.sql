-- =====================================================================
-- NEURA Corporativo — Schema MySQL 8.0+
-- Banco de dados para armazenar diagnósticos organizacionais.
-- =====================================================================
--
-- Como usar no seu VPS:
--   1) mysql -u root -p
--   2) CREATE DATABASE neura_corp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   3) CREATE USER 'neura'@'%' IDENTIFIED BY 'TROQUE_ESTA_SENHA';
--   4) GRANT ALL PRIVILEGES ON neura_corp.* TO 'neura'@'%';
--   5) FLUSH PRIVILEGES;
--   6) USE neura_corp;
--   7) SOURCE /caminho/para/schema.mysql.sql;
-- =====================================================================

CREATE TABLE IF NOT EXISTS diagnostics (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Dados da organização (Tela 3)
  nome            VARCHAR(180)  NOT NULL,
  cargo           VARCHAR(180)  NOT NULL,
  empresa         VARCHAR(180)  NOT NULL,
  setor           VARCHAR(120)  NOT NULL,
  colaboradores   VARCHAR(40)   NOT NULL,
  whatsapp        VARCHAR(40)   NOT NULL,
  email           VARCHAR(180)  NOT NULL,
  consent         TINYINT(1)    NOT NULL DEFAULT 0,

  -- Resultado consolidado
  overall_percent SMALLINT      NOT NULL,

  -- Scores por dimensão (0..100)
  score_alinhamento    SMALLINT NOT NULL DEFAULT 0,
  score_diagnostico    SMALLINT NOT NULL DEFAULT 0,
  score_design         SMALLINT NOT NULL DEFAULT 0,
  score_engajamento    SMALLINT NOT NULL DEFAULT 0,
  score_transferencia  SMALLINT NOT NULL DEFAULT 0,
  score_medicao        SMALLINT NOT NULL DEFAULT 0,
  score_comunicacao    SMALLINT NOT NULL DEFAULT 0,
  score_cultura        SMALLINT NOT NULL DEFAULT 0,
  score_transformacao  SMALLINT NOT NULL DEFAULT 0,

  -- Payload completo (respostas + scores) em JSON para auditoria
  answers_json    JSON          NOT NULL,
  scores_json     JSON          NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_created_at (created_at),
  INDEX idx_empresa (empresa),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
