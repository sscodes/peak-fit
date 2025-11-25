// import SVG from 'react-inlinesvg';
// import { ASSETS } from '../../../helpers/assets';
import { useNavigate } from 'react-router';
import Button from '../../../components/button/Button';
import { DASHBOARD } from '../../../helpers/getters';
import { BUTTON_TYPE, BUTTON_VARIANT } from '../../../helpers/types';
import classes from './PageBrokenError.module.css';

const PageBrokenError = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.errorPageContainer}>
      {/* <SVG src={ASSETS.illustrations.PageBroken} height={270} /> */}
      <div className='tm-h3'>Oops, looks like something broke.</div>
      <div className='tm-subheading'>
        It's not you—it's us. We're on it. In the meantime, try refreshing the
        page or go to homepage.
      </div>
      <div className={classes.buttonSection}>
        <Button
          variant={BUTTON_VARIANT.SECONDARY}
          type={BUTTON_TYPE.BUTTON}
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
        <Button type={BUTTON_TYPE.BUTTON} onClick={() => navigate(DASHBOARD)}>
          Go to homepage
        </Button>
      </div>
    </div>
  );
};

export default PageBrokenError;
