import { Outlet } from 'react-router';
import classes from './styles.module.css';
import clsx from 'clsx';

const AuthLayout = () => {
  return (
    <div className={classes.authLayoutContainer}>
      <div className={clsx(classes.logo, 'hero-large')}>PeakFit</div>
      <div className={classes.authLayout}>
        <Outlet />
      </div>
      {/* <a href="https://www.flaticon.com/free-stickers/workout" title="workout stickers">Workout stickers created by Stickers - Flaticon</a> */}
    </div>
  );
};

export default AuthLayout;
