import { useCallback } from "react";
import { DropEvent, useDropzone } from "react-dropzone";

export function PreviewsDropzone() {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejected, e: DropEvent) => {
      e.preventDefault();

      // Do something with the files
      console.log(acceptedFiles, rejected);
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed rounded-md py-6 px-6"
    >
      <input {...getInputProps()} />
      {acceptedFiles.length === 0 ? (
        isDragActive ? (
          <p>Drop here</p>
        ) : (
          <p className="font-medium">Drag & drop your file or click here</p>
        )
      ) : (
        <p>{acceptedFiles[0].name}</p>
      )}
    </div>
  );
}
