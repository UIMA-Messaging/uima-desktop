import { useEffect, useState } from "react";
import { User } from "../../common/types";

export default function Profile() {
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    window.electron.getProfile().then(setProfile);
  }, []);

  return <img className="profile" src={profile?.image} onClick={window.electron.logout} />;
}
