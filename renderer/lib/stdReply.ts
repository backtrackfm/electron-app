type StdErrorType = {
  details?: unknown; // Posibility to provide further details
  code: 400 | 500; // Sorry!
  type: "not-found" | "conflict" | "validation" | "unknown" | "auth";
};

export type StdReply = {
  data?: unknown;
  error?: StdErrorType;
  clientMessage?: string; // The message displayed to the client
};

// Generated via chatgpt
export function isStdReply(obj: unknown): obj is StdReply {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const stdReply = obj as StdReply;
  return (
    (stdReply.data === undefined || typeof stdReply.data === "object") &&
    (stdReply.error === undefined || isStdError(stdReply.error)) &&
    (stdReply.clientMessage === undefined ||
      typeof stdReply.clientMessage === "string")
  );
}

// Type guard for StdErrorType
function isStdError(obj: unknown): obj is StdErrorType {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const stdError = obj as StdErrorType;
  return (
    typeof stdError.code === "number" &&
    (stdError.code === 400 || stdError.code === 500) &&
    typeof stdError.type === "string" &&
    ["not-found", "conflict", "validation", "unknown"].includes(stdError.type)
  );
}
