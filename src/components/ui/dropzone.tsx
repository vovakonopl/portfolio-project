'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useDropzone } from 'react-dropzone';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Grid,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules';
import Image from 'next/image';
// styles for Swiper
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImagePlus } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES } from '@/scripts/validation-schemes/image-scheme';
import { useResize } from '@/scripts/hooks/useResize';

const acceptedImages = Object.fromEntries(
  ACCEPTED_IMAGE_TYPES.map((imageType: string) => [imageType, []]),
);

type TUploadedImage = {
  url: string;
  name: string;
};

// returns array of TUploadedImage from array of files
function processImageArray(files: File[]): TUploadedImage[] {
  return files.map((file: File) => ({
    url: URL.createObjectURL(file),
    name: file.name,
  }));
}

interface IImageDropzoneProps {
  className?: string;
  errorMessage?: string;
  id?: string;
  name?: string;
  onDrop?: (files: File[]) => void;
  multiple?: boolean;
  multipleThumbnailRows?: boolean;
  maxFiles?: number;
  thumbnailClassName?: string;
  values?: File[];
}

const ImageDropzone: FC<IImageDropzoneProps> = ({
  className,
  errorMessage,
  id,
  name,
  onDrop,
  multiple,
  multipleThumbnailRows,
  maxFiles,
  thumbnailClassName,
  values,
}) => {
  const [uploadedImages, setUploadedImages] = useState<TUploadedImage[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      // cut array if there is more items than was specified
      if (multiple && maxFiles && maxFiles > 0 && files.length > maxFiles) {
        files = files.slice(0, maxFiles);
      }

      onDrop?.(files);

      // update state to generate thumbnails
      setUploadedImages(processImageArray(files));
    },
    multiple,
    accept: acceptedImages,
  });

  // update array of images if values were changed outside of component
  useEffect(() => {
    if (values) {
      setUploadedImages(processImageArray(values));
    }
  }, [values]);

  // Calculates and sets slides per view.
  // Can be passed instead of ref to run function on mount
  const calcSlidesPerView = useCallback(
    (thumbnailEl?: HTMLDivElement | null): void => {
      if (thumbnailEl) {
        thumbnailRef.current = thumbnailEl;
      }

      if (!sliderRef.current || !thumbnailRef.current) return;

      setSlidesPerView(
        Math.floor(
          sliderRef.current.offsetWidth / thumbnailRef.current.offsetWidth,
        ),
      );
    },
    [],
  );

  // recalculate slides per view on resize
  useResize(() => {
    calcSlidesPerView();
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
            Drag and drop {multiple ? 'some images' : 'an image'} here
            <br />
            or click to select
          </p>
        )}

        <ImagePlus className="size-7" />

        {errorMessage && (
          <div className="text-rose-700">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div className="relative px-2" ref={sliderRef}>
          <Swiper
            modules={[Grid, Keyboard, Mousewheel, Navigation, Pagination]}
            slidesPerView={slidesPerView}
            // add second row if items doesn't fit on screen and this option was specified
            grid={{
              rows:
                multipleThumbnailRows && uploadedImages.length > slidesPerView
                  ? 2
                  : 1,
              fill: 'row',
            }}
            keyboard
            mousewheel
            navigation={{
              disabledClass: 'invisible',
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            spaceBetween={8}
            watchOverflow
          >
            {uploadedImages.map((image: TUploadedImage) => {
              return (
                <SwiperSlide className="w-auto" key={Math.random()}>
                  <div
                    className={cn('aspect-video h-16', thumbnailClassName)}
                    ref={calcSlidesPerView}
                  >
                    <Image
                      src={image.url}
                      alt={image.name}
                      // 16:9
                      width={256}
                      height={144}
                      className="h-full w-full select-none rounded-sm object-cover object-center"
                    />
                  </div>
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
