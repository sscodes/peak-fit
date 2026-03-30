import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import classes from "./Dock.module.css";

export interface DockItem {
  id: string;
  route: string;
  icon: ReactNode;
  label: string;
}

const Dock = ({
  routes,
  selectedRoute,
}: {
  routes: DockItem[];
  selectedRoute: string;
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className={classes.containerStyle}>
      {routes.map((item) => {
        const isHovered = hoveredItem === item.id;
        const isActive = selectedRoute === item.route;

        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            className={classes.itemContainerStyle}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate(item.route)}
          >
            <span
              className={clsx(
                classes.labelStyle,
                isHovered ? classes.labelStyleHovered : "",
              )}
            >
              {item.label}
            </span>
            <div
              className={clsx(
                classes.dockItem,
                isHovered ? classes.dockItemHovered : "",
                isActive ? classes.active : "",
              )}
            >
              {item.icon}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Dock;
