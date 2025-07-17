import React, { useState } from "react";
import { RoleInputTable, type RoleCost } from "./components/RoleInputTable";
import { TargetInput } from "./components/TargetInput";
import { SolveButton } from "./components/SolveButton";
import { ResultPane } from "./components/ResultPane";
import { ErrorToast } from "./components/ErrorToast";
import { solve_indefinite_equation } from "./solve";
import { Loader2 } from "lucide-react";

const defaultRoles: RoleCost[] = [
  { role: "主任技師", cost: 66900, count: 1 },
  { role: "技師(A)", cost: 59600, count: 1 },
  { role: "技師(B)", cost: 48500, count: 1 },
  { role: "技師(C)", cost: 40300, count: 1 },
  { role: "技術員", cost: 36100, count: 1 },
];

export const App: React.FC = () => {
  const [roles, setRoles] = useState<RoleCost[]>(defaultRoles);
  const [target, setTarget] = useState<number>(20000);
  const [result, setResult] = useState<{
    roles: RoleCost[];
    solutions: [number, number[]][];
  }>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (roles.some((r) => r.cost < 1 || r.count < 1)) {
      return "基準日額・人数はすべて1以上の自然数で入力してください。";
    }
    if (roles.some((r) => r.role.trim() === "")) {
      return "職種名は空欄にできません。";
    }
    if (new Set(roles.map((r) => r.role)).size !== roles.length) {
      return "職種名が重複しています。";
    }
    if (!target || target < 1) {
      return "目標金額は1以上の自然数で入力してください。";
    }
    return null;
  };

  const handleSolve = () => {
    const err = validate();
    if (err) {
      setError(err);
      setResult({ roles: [], solutions: [] });
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const solutions = solve_indefinite_equation(roles, target * 1000);
      setResult({ roles, solutions });
      setLoading(false);
    }, 0); // Use setTimeout to avoid blocking UI updates
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="font-bold text-2xl mb-4 text-center">人件費計算</h1>
      <RoleInputTable roles={roles} onChange={setRoles} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex justify-center">
          <TargetInput value={target} onChange={setTarget} />
        </div>
        <SolveButton
          onClick={handleSolve}
          disabled={loading}
          loading={loading}
        />
      </div>
      {loading ? (
        <div className="p-4 border rounded-md flex flex-col items-center justify-center min-h-[120px] animate-pulse bg-muted/50">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-muted-foreground" />
          <div className="h-4 w-1/2 bg-muted rounded mb-2" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
      ) : result && !error ? (
        <ResultPane solutions={result.solutions} roles={result.roles} />
      ) : null}
      <ErrorToast message={error} onClose={() => setError("")} />
    </div>
  );
};
