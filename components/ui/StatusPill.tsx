import { AlertTriangle, CheckCircle2 } from "lucide-react";

type StatusPillProps = {
  errorCount: number;
  isValid: boolean;
};

// Shows the current validation status for an editor or application workflow.
export function StatusPill({ errorCount, isValid }: StatusPillProps) {
  return (
    <span className={isValid ? "status-pill ok" : "status-pill warning"}>
      {isValid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      {isValid ? "JSON valido" : `${errorCount} alerta(s)`}
    </span>
  );
}
