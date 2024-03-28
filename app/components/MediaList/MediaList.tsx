import { Files } from "@/app/models/file.model";
import Image from "next/image";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import styles from "./MediaList.module.scss";
import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "swiper/css";
import "./swiper.scss";
import ReactPlayer from "react-player";

export const MediaList: FC<{
  files: Files[];
  setMediaFile: Dispatch<SetStateAction<Files | null>>;
  mediaFile: Files | null;
}> = ({ files, setMediaFile, mediaFile }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const handleBack = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleForward = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);

  const mediaFiles = files.filter(
    (file) =>
      file.type.split("/")[0] === "image" || file.type.split("/")[0] === "video"
  );

  useEffect(() => {
    if (mediaFile) {
      const index = mediaFiles.findIndex((file) => file.id === mediaFile.id);
      if (index !== -1 && swiperRef) {
        swiperRef.slideTo(index);
      }
    }
  }, [mediaFile, mediaFiles, swiperRef]);

  return (
    <>
      <div className={styles.close} onClick={() => setMediaFile(null)} />

      <div className={styles.swiper__wrapper}>
        <Swiper
          loop
          spaceBetween={0}
          slidesOffsetAfter={0}
          onSwiper={setSwiperRef}
          className="mediaListSwiper"
        >
          {mediaFiles.map((file) => (
            <>
              <SwiperSlide key={file.id}>
                {file.type.split("/")[0] === "image" && (
                  <img src={file.content} alt="file" className={styles.image} />
                )}

                {file.type.split("/")[0] === "video" && (
                  <div className={styles.video}>
                    <ReactPlayer
                      url={file.content}
                      controls
                      style={{
                        width: "100%",
                        height: "fit-content",
                        maxWidth: "100vw",
                        maxHeight: "50vh",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
              </SwiperSlide>
            </>
          ))}
        </Swiper>

        {mediaFiles.length > 1 && (
          <>
            <Button
              onClick={handleBack}
              variant="text"
              className={styles.buttons__back}
            >
              <ArrowBackIosNewIcon color="primary" />
            </Button>
            <Button
              className={styles.buttons__forward}
              onClick={handleForward}
              variant="text"
            >
              <ArrowForwardIosIcon color="primary" />
            </Button>
          </>
        )}
      </div>
    </>
  );
};
