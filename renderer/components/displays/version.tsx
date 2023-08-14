import { VersionWithPreview } from "../dashboard-versions";

interface VersionDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  num: number;
  version: VersionWithPreview;
}

export function VersionDisplay({ num, version }: VersionDisplayProps) {
  return (
    <div>
      #{num} {version.name}
    </div>
  );
}
