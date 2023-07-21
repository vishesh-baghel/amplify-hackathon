// components/Home.js
import { Heading } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import { Storage } from "@aws-amplify/storage";

const handleStorage = async () => await Storage.put("test.txt", "Hello");

export function Home() {
  return (
    <>
      <Heading level={3}>
        Please use the buttons at the top to test out protected routes!
      </Heading>
      <button onClick={handleStorage}>Test Storage</button>
      <input type="file" />
      <StorageManager
        acceptedFileTypes={["image/*"]}
        accessLevel="public"
        maxFileCount={1}
        isResumable
      />
    </>
  );
}