import { Users } from "@/models/User";
import { FilesList } from "./components/FilesList/FilesList";

export default async function Home() {
  const folders = [
    "AFSDF",
    "dfgg",
    "dfgdd",
    "dfsfsdfsdfggddddd",
    "dfgg",
    "gggg",
    "dgdfgd",
    "fghghf",
    "asd",
  ];

  return (
    <main>
      <FilesList files={folders} />

      {/* {users.map((user: any) => (
        <p key={user.id}>{user.email}</p>
      ))} */}
    </main>
  );
}
