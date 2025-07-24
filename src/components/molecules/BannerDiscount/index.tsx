"use client";

import { CustomDot } from "@/components/atoms/CustomDot";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  path: string;
  category: string;
  isActive?: boolean;
  isShow?: boolean;
}

interface DiscountBannerProps {
  bannerData: BannerItem[];
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
}

export const DiscountBanner: React.FC<DiscountBannerProps> = ({
  bannerData,
  isHovered,
  setIsHovered,
}) => {
  const filteredBanners = bannerData.filter(
    (item) => item.category?.trim().toLowerCase() === "discount"
  );

  if (filteredBanners.length === 0) return null;

  return (
    <div
      className="flex h-auto lg:h-[100vh] items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay
        autoPlaySpeed={4000}
        centerMode={false}
        containerClass="carousel-container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass="h-full lg:h-[100vh]"
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            partialVisibilityGutter: 40,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            partialVisibilityGutter: 30,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            partialVisibilityGutter: 30,
          },
        }}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
        swipeable
        className="h-full w-full"
        customDot={<CustomDot />}
      >
        {filteredBanners.map((item) => (
          <div
            key={item.id}
            className="flex h-auto lg:h-[105vh] items-center justify-center"
          >
            <div className="relative h-[40vh] lg:h-[100%] w-full">
              <Image
                src={item.path}
                alt={item.title}
                fill
                className="object-cover"
                priority={true}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
