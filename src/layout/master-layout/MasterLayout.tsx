import { useEffect, useState } from "react";
import { HiCog, HiSearch } from "react-icons/hi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { VscSparkleFilled } from "react-icons/vsc";
import { Outlet, useLocation } from "react-router";
import Dock, { type DockItem } from "../../components/dock/Dock";
import { COACH, DASHBOARD, EXPLORE, SETTINGS } from "../../helpers/getters";
import classes from "./MasterLayout.module.css";

const dockItems: DockItem[] = [
  {
    id: "dashboard",
    route: DASHBOARD,
    icon: <TbLayoutDashboardFilled size={24} />,
    label: "Dashboard",
  },
  {
    id: "explore",
    route: EXPLORE,
    icon: <HiSearch size={24} />,
    label: "Explore",
  },
  {
    id: "coach",
    route: COACH,
    icon: <VscSparkleFilled size={24} />,
    label: "Coach",
  },
  {
    id: "settings",
    route: SETTINGS,
    icon: <HiCog size={24} />,
    label: "Settings",
  },
];

const MasterLayout = () => {
  const [showDock, setShowDock] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;
      const triggerZone = viewportHeight - 125;

      if (mouseY >= triggerZone) {
        setShowDock(true);
      } else {
        setShowDock(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={classes.masterLayout}>
      <Outlet />
      <div
        className={classes.footer}
        style={{
          height: "80px",
          bottom: showDock ? "20px" : "-80px",
          transition: "bottom 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Dock routes={dockItems} selectedRoute={location.pathname} />
      </div>
    </div>
  );
};

export default MasterLayout;
