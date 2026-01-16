import { Button } from "../ui/button";
import { Icon, IconName } from "../ui/icon-picker";
import { cn } from "@/lib/utils";

interface ActionType {
  label?: string;
  icon?: IconName;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function ButtonTemplate({ label, icon, onClick, disabled }: ActionType) {
  return (
    <Button
      key={label}
      disabled={disabled}
      onClick={onClick}
      size={icon && !label ? "icon" : "default"}
      variant="secondary"
      className={cn("my-auto gap-2", icon && label && "ps-3")}
    >
      {icon && <Icon name={icon} className="size-5" />}{" "}
      {label && <p>{label}</p>}
    </Button>
  );
}

export default ButtonTemplate;
