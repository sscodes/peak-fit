// import SVG from 'react-inlinesvg';
// import { ASSETS } from '../../../helpers/assets';
import classes from './styles.module.css';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { HOME } from '../../../helpers/getters';
import Button from '../../../components/button/Button';
import { BUTTON_TYPE } from '../../../helpers/types';

const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.errorPageContainer}>
      {/* <SVG src={ASSETS.illustrations.PageNotFound} height={270} /> */}
      <div className='tm-h3'>Page Not Found</div>
      <div className='tm-subheading'>
        Looks like this page took a coffee break ☕
      </div>
      <div className={clsx(classes.errorCode, 'tm-h5')}>Error Code: 404</div>
      <Button type={BUTTON_TYPE.BUTTON} onClick={() => navigate(HOME)}>
        Go to homepage
      </Button>
    </div>
  );
};

export default Error404Page;
