import clsx from "clsx";
import { Outlet, useNavigate } from "react-router";
import useMediaQuery from "@/hooks/useMediaQuery";
import classes from "./AuthLayout.module.css";

const AuthLayout = () => {
  const navigate = useNavigate();
  const isExtraSmall = useMediaQuery("576px");
  return (
    <div className={classes.authLayoutContainer}>
      {!isExtraSmall && (
        <div
          className={clsx(classes.logo, "hero-large")}
          onClick={() => navigate("/")}
        >
          PeakFit
        </div>
      )}
      <div className={classes.authLayout}>
        <Outlet />
      </div>
      {/* <a href="https://www.flaticon.com/free-stickers/workout" title="workout stickers">Workout stickers created by Stickers - Flaticon</a> */}
      {/* <a href="https://www.flaticon.com/free-stickers/gym" title="gym stickers">Gym stickers created by Stickers - Flaticon</a> */}
    </div>
  );
};

export default AuthLayout;
