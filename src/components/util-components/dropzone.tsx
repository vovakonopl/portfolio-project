import { cn } from '@/scripts/classname';
import { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import AddImage from '@/assets/icons/add-image.svg';

interface IDropzoneProps {
  onDrop?: (files: Array<File>) => void;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  multiple?: boolean;
}

const Dropzone: FC<IDropzoneProps> = ({ onDrop, onChange, multiple }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });
  return (
    <div
      {...getRootProps()}
      className={cn(
        'mt-2 flex h-36 flex-col items-center justify-center gap-2 rounded border border-gray-400 px-4 py-2 text-center text-gray-400 outline-none outline-1 outline-offset-0 transition-all focus:border-blue-400 focus:text-blue-400 focus:outline-blue-400',
        isDragActive && 'border-blue-400 text-blue-400 outline-blue-400',
      )}
    >
      <input {...getInputProps()} onChange={onChange} />

      {isDragActive ? (
        <p>Drop the images here</p>
      ) : (
        <p>
          Drag and drop some images here,
          <br />
          or click to select images
        </p>
      )}

      <AddImage />
    </div>
  );
};

export default Dropzone;
