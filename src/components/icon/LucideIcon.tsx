import { icons, type LucideProps } from "lucide-react";
import type { FC } from "react";

interface LucideIconProps {
  name: string;
  size?: number;
  className?: string;
}

const LucideIcon: FC<LucideIconProps> = ({ name, size = 16, className = "", ...props }) => {
  // Try the raw name first (handles already-PascalCase inputs like "ArrowLeft")
  const rawKey = name as keyof typeof icons;
  let IconComponent = icons[rawKey] as FC<LucideProps> | undefined;

  // Fall back to normalizing kebab-case/snake_case to PascalCase
  if (!IconComponent) {
    const pascalCaseName = name
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    const iconKey = pascalCaseName as keyof typeof icons;
    IconComponent = icons[iconKey] as FC<LucideProps> | undefined;
  }

  if (!IconComponent) {
    const Fallback = icons["Info"] as FC<LucideProps>;
    return Fallback ? (
      <Fallback size={size} className={className} {...props} />
    ) : null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default LucideIcon;
