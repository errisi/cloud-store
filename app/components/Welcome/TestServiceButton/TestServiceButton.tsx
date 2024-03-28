import { Button } from "@mui/material";
import { FC } from "react";
import * as UserActions from "@/app/store/reducers/User";
import { useAppDispatch } from "../../../store/hooks";

export const TestServiceButton: FC<{ className: any }> = ({ className }) => {
  const dispatch = useAppDispatch();

  const connectToTestAccount = async () => {
    const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL!;
    const password = process.env.NEXT_PUBLIC_TEST_USER_PASSWORD!;

    await dispatch(UserActions.init({ email, password }));
  }

  return (
    <Button variant="outlined" className={className ? className : ''} onClick={connectToTestAccount}>
      Tets
    </Button>
  );
}