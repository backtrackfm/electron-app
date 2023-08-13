import { Version } from "@/lib/types";

interface VersionDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  num: number;
  version: Version;
}

export function VersionDisplay({ num, version }: VersionDisplayProps) {
  return (
    <div>
      #{num} {version.name}
    </div>
  );
}
