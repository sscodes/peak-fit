import type { IconBaseProps, IconType } from "react-icons";
import type { FC } from "react";

interface IconProps extends IconBaseProps {
  icon: IconType;
  className?: string;
}

const Icon: FC<IconProps> = ({
  icon: IconComponent,
  size = 16,
  className = "",
  ...props
}) => {
  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon;
