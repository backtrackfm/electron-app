import { cn, getStringColor } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export default function Tag(props: TagProps) {
  return (
    <Badge
      className={cn(
        getStringColor(props.name),
        props.className,
        `px-3 rounded-full hover:${getStringColor(props.name)}`
      )}
      style={props.style}
    >
      {props.name}
    </Badge>
  );
}
