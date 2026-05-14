import { useNavigate } from 'react-router';
import Button from '@/components/button/Button';
import { ASSETS } from '@/helpers/assets';
import { DASHBOARD } from '@/helpers/getters';
import { BUTTON_TYPE, BUTTON_VARIANT } from '@/helpers/types';
import classes from './PageBrokenError.module.css';
import { IoReloadSharp } from 'react-icons/io5';

const PageBrokenError = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.errorPageContainer}>
      <img src={ASSETS.illustrations.StayStrong2} height={250} />
      <div className='heading-3'>This page is catching its breath 😮‍💨</div>
      <div className='subtitle-regular'>
        A minor cramp in the system. We'll be back in action shortly.
      </div>
      <div className={classes.buttonSection}>
        <Button
          variant={BUTTON_VARIANT.SECONDARY}
          type={BUTTON_TYPE.BUTTON}
          onClick={() => window.location.reload()}
        >
          <IoReloadSharp style={{ marginRight: '4px' }} /> Reload
        </Button>
        <Button type={BUTTON_TYPE.BUTTON} onClick={() => navigate(DASHBOARD)}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PageBrokenError;
