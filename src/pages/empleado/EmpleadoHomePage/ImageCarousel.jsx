import React, { useState, useEffect} from "react";
import styles from "/src/pages/empleado/EmpleadoHomePage/EmpleadoHomePage.module.css";

const images = [
  {src:"/images/software-development.jpg", headline: "Welcome to the Announcements Tab!"},
  {src:"/images/accenture-img1.jpg", headline: "Accenture Stocks go up 50%"},
  {src:"/images/agile-methodology.jpg", headline: "Take this course on the Agile Methodology."},
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
          <div
            key={index}
            className={styles.carouselSlide}
            style={{ backgroundImage: `url(${image.src})` }}
          >
          </div>
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
