import { icons, type LucideProps } from "lucide-react";
import type { FC } from "react";

interface LucideIconProps {
  name: string;
  size?: number;
  className?: string;
}

const LucideIcon: FC<LucideIconProps> = ({ name, size = 16, className = "", ...props }) => {
  const pascalCaseName = name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  const iconKey = pascalCaseName as keyof typeof icons;
  const IconComponent = icons[iconKey] as FC<LucideProps>;

  if (!IconComponent) {
    const Fallback = icons["Info"] as FC<LucideProps>;
    return Fallback ? (
      <Fallback size={size} className={className} {...props} />
    ) : null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default LucideIcon;
