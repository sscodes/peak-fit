import clsx from 'clsx';
import { useNavigate } from 'react-router';
import Button from '@/components/button/Button';
import { ASSETS } from '@/helpers/assets';
import { DASHBOARD } from '@/helpers/getters';
import { BUTTON_TYPE } from '@/helpers/types';
import classes from './Error404Page.module.css';

const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.errorPageContainer}>
      <img src={ASSETS.illustrations.StayStrong1} height={270} />
      <div className='heading-3'>Page Not Found</div>
      <div className='subtitle-regular'>
        Looks like this page skipped leg day 😅
      </div>
      <div className={clsx(classes.errorCode, 'heading-6')}>
        Error Code: 404
      </div>
      <Button type={BUTTON_TYPE.BUTTON} onClick={() => navigate(DASHBOARD)}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Error404Page;
