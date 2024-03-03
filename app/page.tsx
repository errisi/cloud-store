import Image from "next/image";
import { Folder } from "./components/Folder/Folder";
import { FilesList } from "./components/FilesList/FilesList";

export default function Home() {
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
    </main>
  );
}
