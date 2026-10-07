import { LookbookHeader } from "./LookbookHeader";
import { LookbookRack } from "./LookbookRack";
import { LookbookPhotoUpload } from "./LookbookPhotoUpload";

export function LookbookView() {
  return (
    <>
      <LookbookHeader />
      <LookbookRack />
      <LookbookPhotoUpload />
    </>
  );
}
