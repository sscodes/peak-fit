// import Header from '@/components/header/Header';
import { Outlet } from 'react-router';
import classes from './styles.module.css';

const AuthLayout = () => {
  return (
    <div className={classes.app}>
      {/* <Header /> */}
      <div className={classes.authLayout}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
