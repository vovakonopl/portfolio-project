'use client';

import { FC, useState } from 'react';
import { cn } from '@/lib/cn';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_IMAGE_TYPES } from '@/scripts/validation-schemes/product-upload-scheme';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Grid,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules';
import Image from 'next/image';
import AddImage from '@/assets/icons/add-image.svg';
// styles for Swiper
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const acceptedImages = Object.fromEntries(
  ACCEPTED_IMAGE_TYPES.map((imageType: string) => [imageType, []]),
);

interface IUploadedImage {
  url: string;
  name: string;
}

interface IImageDropzoneProps {
  className?: string;
  errorMessage?: string;
  id?: string;
  name?: string;
  onDrop?: (files: Array<File>) => void;
  multiple?: boolean;
}

const ImageDropzone: FC<IImageDropzoneProps> = ({
  className,
  errorMessage,
  id,
  name,
  onDrop,
  multiple,
}) => {
  const [uploadedImages, setUploadedImages] = useState<Array<IUploadedImage>>(
    [],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: Array<File>) => {
      onDrop?.(files);

      // update state to generate thumbnails
      const imageUrls: Array<IUploadedImage> = files.map((file: File) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setUploadedImages(imageUrls);
    },
    multiple,
    accept: acceptedImages,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          'mt-2 flex h-36 select-none flex-col items-center justify-center gap-2 rounded border border-gray-400 px-4 py-2 text-center text-gray-400 outline-none outline-1 outline-offset-0 transition-all focus:border-blue-400 focus:text-blue-400 focus:outline-blue-400',
          className,
          isDragActive && 'border-blue-400 text-blue-400 outline-blue-400',
          errorMessage && 'border-rose-700 outline-rose-700',
        )}
      >
        <input {...getInputProps()} id={id} name={name} />

        {isDragActive ? (
          <p>Drop the images here</p>
        ) : (
          <p>
            Drag and drop some images here,
            <br />
            or click to select images
          </p>
        )}

        <AddImage className="size-7" />

        {errorMessage && (
          <div className="text-rose-700">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div className="swiper-container center-inactive">
          <Swiper
            modules={[Grid, Keyboard, Mousewheel, Navigation, Pagination]}
            slidesPerView="auto"
            // if more than 10 items => 2 rows
            grid={{ rows: uploadedImages.length < 10 ? 1 : 2, fill: 'row' }}
            keyboard
            mousewheel
            navigation={{
              disabledClass: 'invisible',
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            watchOverflow
            spaceBetween={8}
          >
            {uploadedImages.map((image: IUploadedImage) => {
              return (
                <SwiperSlide key={Math.random()} className="w-auto">
                  <Image
                    src={image.url}
                    alt={image.name}
                    // 16:9
                    width={96}
                    height={48}
                    className="center aspect-video max-h-12 max-w-24 select-none rounded-sm object-cover object-center"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
