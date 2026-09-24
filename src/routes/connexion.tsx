import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OrbitGlyph } from "@/components/orbit/glyph";
import { SplashMark } from "@/components/orbit/provider";
import { StarterLiftsForm } from "@/components/orbit/starter-lifts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAge, formatBodyweight, formatHeight } from "@/lib/orbit/format";
import { SEX_LABEL } from "@/lib/orbit/labels";
import type { Sex, StarterPerf } from "@/lib/orbit/types";
import { useOrbitStore } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connexion")({ component: Connexion });

function Connexion() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState<Sex>("homme");
  const [age, setAge] = useState("18");
  const [height, setHeight] = useState("178");
  const [weight, setWeight] = useState("74");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const login = useOrbitStore((s) => s.login);
  const register = useOrbitStore((s) => s.register);
  const hydrated = useOrbitStore((s) => s.hydrated);
  const navigate = useNavigate();

  function goApp() {
    void navigate({ to: "/app/feed" });
  }

  function onLogin(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const r = login(pseudo, password);
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    goApp();
  }

  function submitRegister(perfs: StarterPerf[]) {
    if (busy) return { ok: false as const, error: "Patiente." };
    setBusy(true);
    setError("");
    const r = register({
      pseudo,
      password,
      sex,
      age: Number(age),
      height: Number(height),
      bodyweight: Number(String(weight).replace(",", ".")),
      perfs,
    });
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return r;
    }
    goApp();
    return { ok: true as const };
  }

  const athleteOk =
    Number(age) >= 13 &&
    Number(age) <= 80 &&
    Number(height) >= 120 &&
    Number(String(weight).replace(",", ".")) >= 30;

  if (!hydrated) return <SplashMark />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-16 items-center justify-center rounded-full bg-surface text-accent shadow-[var(--shadow-glow)]">
          <OrbitGlyph size={40} />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-[0.22em]">ORBIT</h1>
        <p className="text-sm text-muted">Force, rangs, séances. Simple.</p>
      </div>

      {step < 2 ? (
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
          <button
            className={cn("h-10 rounded-lg text-sm", mode === "login" && "bg-accent text-accent-fg")}
            onClick={() => {
              setMode("login");
              setStep(0);
              setError("");
            }}
          >
            Connexion
          </button>
          <button
            className={cn("h-10 rounded-lg text-sm", mode === "register" && "bg-accent text-accent-fg")}
            onClick={() => {
              setMode("register");
              setStep(0);
              setError("");
            }}
          >
            Créer un compte
          </button>
        </div>
      ) : null}

      {mode === "login" ? (
        <form onSubmit={onLogin} className="grid gap-3">
          <div>
            <Label>Pseudo</Label>
            <Input className="mt-1" value={pseudo} onChange={(e) => setPseudo(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input
              className="mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" size="lg" disabled={busy}>
            Entrer
          </Button>
        </form>
      ) : step === 0 ? (
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (pseudo.trim().length < 2) {
              setError("Pseudo trop court.");
              return;
            }
            if (password.length < 4) {
              setError("Mot de passe trop court.");
              return;
            }
            setError("");
            setStep(1);
          }}
        >
          <div>
            <Label>Pseudo</Label>
            <Input className="mt-1" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input className="mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" size="lg">
            Continuer
          </Button>
        </form>
      ) : step === 1 ? (
        <div className="grid gap-3">
          <p className="text-sm text-muted">Sexe et âge servent aux rangs. Taille et poids sont suivis, ils n’entrent pas dans le score.</p>
          <div className="flex gap-1">
            {(Object.keys(SEX_LABEL) as Sex[]).map((sx) => (
              <button
                key={sx}
                onClick={() => setSex(sx)}
                className={cn(
                  "h-10 flex-1 rounded-lg text-sm",
                  sex === sx ? "bg-accent text-accent-fg" : "bg-surface-2",
                )}
              >
                {SEX_LABEL[sx]}
              </button>
            ))}
          </div>
          <div>
            <Label>Âge ({formatAge(Number(age) || 0)})</Label>
            <Input className="mt-1" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label>Taille ({formatHeight(Number(height) || 0)})</Label>
            <Input className="mt-1" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <Label>Poids ({formatBodyweight(Number(String(weight).replace(",", ".")) || 0)})</Label>
            <Input className="mt-1" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button size="lg" disabled={!athleteOk || busy} onClick={() => setStep(2)}>
            Continuer
          </Button>
          <Button variant="ghost" onClick={() => setStep(0)}>
            Retour
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          <StarterLiftsForm submitLabel="Entrer dans ORBIT" busy={busy} onSubmit={submitRegister} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button variant="ghost" onClick={() => setStep(1)}>
            Retour
          </Button>
        </div>
      )}
    </main>
  );
}
