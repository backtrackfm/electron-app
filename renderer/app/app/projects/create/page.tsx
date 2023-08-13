import { useContext } from "react";
import { UserContext } from "../../layout";

export default function CreateProjectPage() {
  const user = useContext(UserContext);

  return <div>{user.name}</div>;
}
