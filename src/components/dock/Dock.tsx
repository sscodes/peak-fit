import clsx from 'clsx';
import * as React from 'react';
import { useNavigate } from 'react-router';
import classes from './Dock.module.css';

export interface DockItem {
  id: string;
  route: string;
  icon: React.ReactNode;
  label: string;
}

const Dock = ({
  routes,
  selectedRoute,
}: {
  routes: DockItem[];
  selectedRoute: string;
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className={classes.containerStyle}>
      {routes.map((item) => {
        const isHovered = hoveredItem === item.id;
        const isActive = selectedRoute === item.route;

        return (
          <div
            key={item.id}
            className={classes.itemContainerStyle}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => navigate(item.route)}
          >
            <span
              className={clsx(
                classes.labelStyle,
                isHovered ? classes.labelStyleHovered : ''
              )}
            >
              {item.label}
            </span>
            <div
              className={clsx(
                classes.dockItem,
                isHovered ? classes.dockItemHovered : '',
                isActive ? classes.active : ''
              )}
            >
              {item.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dock;
