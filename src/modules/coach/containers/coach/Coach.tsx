import React from "react";
import { useNavigate } from "react-router";
import { ONBOARDING_QUESTIONNAIRE } from "../../../../helpers/getters";
import { useAppSelector } from "../../../../hooks/redux";
import { selectProfile } from "../../../../store/authSlice";

const Coach = () => {
  const user = useAppSelector(selectProfile);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user?.is_onboarded) {
      navigate(ONBOARDING_QUESTIONNAIRE);
    }
  }, [user, navigate]);
  return <div></div>;
};

export default Coach;
