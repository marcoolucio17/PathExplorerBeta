import React, { useState, useEffect} from "react";
import styles from "/src/pages/empleado/EmpleadoHomePage/EmpleadoHomePage.module.css";

const images = [
  {src:"/images/accenture-news.png", headline: "Accenture Stocks go up 50%", link: "https://www.accenture.com/us-en"},
  {src:"/images/codex.png", headline: "Welcome to the Announcements Tab!", link: "https://openai.com/index/introducing-codex/"},
  {src:"/images/agile.png", headline: "Take this course on the Agile Methodology.", link: "https://www.pmi.org/learning/agile"},
];


export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carouselTrack}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
      {images.map((image, index) => (
        <a
          key={index}
          href={image.link} // URL for this image
          target="_blank"
          rel="noopener noreferrer"
          className={styles.carouselSlide}
          style={{ backgroundImage: `url(${image.src})` }}
        >
        </a>
      ))}
      </div>

      <div className={styles.carouselButtons}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
