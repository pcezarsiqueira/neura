import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { DiagnosticProvider } from "@/state/diagnosticContext";

import LandingPage from "./routes/index";
import AdminPage from "./routes/admin";
import DadosPage from "./routes/dados";
import DiagnosticoPage from "./routes/diagnostico";
import PropostaPage from "./routes/proposta";
import ResultadoPage from "./routes/resultado";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-foreground">
      <div className="text-center">
        <h1 className="font-bebas text-8xl text-cyan-gradient">404</h1>
        <p className="uppercase-label mt-4" style={{ color: "rgba(248,246,242,0.55)" }}>
          Rota não encontrada
        </p>
        <Link to="/" className="btn-ghost inline-block mt-8 text-[10px]">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DiagnosticProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagnostico" element={<DiagnosticoPage />} />
          <Route path="/dados" element={<DadosPage />} />
          <Route path="/resultado" element={<ResultadoPage />} />
          <Route path="/proposta" element={<PropostaPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DiagnosticProvider>
    </BrowserRouter>
  );
}
