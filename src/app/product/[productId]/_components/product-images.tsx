'use client';

import {
  Children,
  FC,
  isValidElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import './product-images.css';

interface IProductImagesProps {
  children: ReactNode;
}

// Receives Image components as children and renders them with Swiper
const ProductImages: FC<IProductImagesProps> = ({ children }) => {
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const images = useMemo(
    () => Children.toArray(children).filter(isValidElement),
    [children],
  );

  useEffect(() => {
    setActiveImgIdx(0); // reset active image when content changes
  }, [children]);

  return (
    <div className="product-images flex gap-2 overflow-hidden">
      {/* image slider */}
      {images.length > 1 && (
        <Swiper
          autoHeight={true}
          className="product-images__slider"
          direction="vertical"
          modules={[Mousewheel, Navigation]}
          mousewheel={true}
          navigation={{
            disabledClass: 'hidden',
            prevEl: '.product-images__prev',
            nextEl: '.product-images__next',
          }}
          slidesPerView="auto"
          slideToClickedSlide={true}
          spaceBetween={8}
        >
          {images.map((image, idx) => (
            <SwiperSlide
              className={cn(
                'product-images__slide',
                idx === activeImgIdx && 'active',
              )}
              onClick={() => setActiveImgIdx(idx)}
              key={Math.random()}
            >
              {image}
            </SwiperSlide>
          ))}

          {/* navigation buttons */}
          <div className="product-images__navigation absolute inset-0">
            <div className="product-images__prev">
              <ChevronUp className="size-6" />
              <div className="arrow"></div>
            </div>
            <div className="product-images__next">
              <ChevronDown className="size-6" />
              <div className="arrow"></div>
            </div>
          </div>
        </Swiper>
      )}

      {/* active image */}
      <div className="product-images__active-image">{images[activeImgIdx]}</div>
    </div>
  );
};

export default ProductImages;
