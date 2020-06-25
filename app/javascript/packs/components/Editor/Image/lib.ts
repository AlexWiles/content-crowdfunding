import { EditorState, AtomicBlockUtils } from "draft-js";
import { post } from "../../../lib/api";
import { validateFile } from "../../../lib/valid";

export type ImageEntityData = {
  src: string;
  uncommaId: number;
  width: string;
  shadow: boolean;
};

export const initialImageEntityData = ({
  id,
  resourceURL,
}: {
  resourceURL: string;
  id: number;
}): ImageEntityData => ({
  uncommaId: id,
  width: "100%",
  src: resourceURL + "/image/" + id,
  shadow: false,
});

export const imageSrc = (resourceURL: string, imageId: number) => {
  return resourceURL + "/image/" + imageId;
};

export const handleImages = (
  files: FileList | Blob[],
  resourceURL: string,
  editorState: EditorState,
  fakeImages: boolean,
  onChange: (s: EditorState) => void
) => {
  if (fakeImages) {
    readFile(files).then((data: string) => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "IMAGE",
        "IMMUTABLE",
        { src: data }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });

      const newState = AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        " "
      );
      onChange(newState);
    });
  } else {
    readFile(files)
      .then((data) => uploadFile(resourceURL, data))
      .then((id: number) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "IMAGE",
          "IMMUTABLE",
          { src: resourceURL + "/image/" + id, uncommaId: id }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });

        const newState = AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          " "
        );
        onChange(newState);
      })
      .catch(() => {});
  }
};

const validationOptions = {
  onlyOne: true,
  okMsg: "Looks good",
  fileTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  maxSize: 10485760,
};

const readFile = (files: FileList | Blob[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
    };

    const validState = validateFile(validationOptions, files);

    if (files && files[0] && validState.validState === "yes") {
      reader.readAsDataURL(files[0]);
    } else {
      reject();
    }
  });
};

const uploadFile = async (
  resourceURL: string,
  data: string | Blob
): Promise<number> => {
  const { id } = await post(resourceURL + "/image_upload", {
    image: data,
  });
  return id;
};

export const uploadImageAtURL = async (url: string, resourceURL: string) => {
  const resp = await fetch(url);
  const blob = await resp.blob();
  return await uploadFile(resourceURL, blob);
};

export const findImageEntities = (
  contentBlock: Draft.ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: Draft.ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "IMAGE"
    );
  }, callback);
};
