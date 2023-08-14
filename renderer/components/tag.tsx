import { cn, getStringColor } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export default function Tag(props: TagProps) {
  return (
    <div
      className={cn(
        getStringColor(props.name),
        props.className,
        "px-3 w-full rounded-full"
      )}
      style={props.style}
    >
      {props.name}
    </div>
  );
}
