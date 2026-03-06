import React from "react";
import type { IconBaseProps, IconType } from "react-icons";
import { icons, type LucideProps } from "lucide-react";

interface IconProps extends IconBaseProps {
  icon?: IconType;
  name?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  name,
  size = 16,
  className = "",
  ...props
}) => {
  // 1. React Icons support
  if (IconComponent) {
    return <IconComponent size={size} className={className} {...props} />;
  }

  // 2. Lucide Icons support (Dynamic)
  if (name) {
    const pascalCaseName = name
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    // Cast the string to a valid key of the icons object
    const iconKey = pascalCaseName as keyof typeof icons;
    const LucideIcon = icons[iconKey] as React.FC<LucideProps>;

    if (!LucideIcon) {
      // Use "Info" as a stable fallback that exists in all versions
      const Fallback = icons["Info"] as React.FC<LucideProps>;
      return Fallback ? (
        <Fallback size={size} className={className} {...props} />
      ) : null;
    }

    return <LucideIcon size={size} className={className} {...props} />;
  }

  return null;
};

export default Icon;
