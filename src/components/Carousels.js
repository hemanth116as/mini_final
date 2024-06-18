import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logoImage from "C:/Users/91934/OneDrive/Desktop/mini_project/src/images/image2.jpeg";
import imageImage from "C:/Users/91934/OneDrive/Desktop/mini_project/src/images/image1.jpeg";
import image1Image from "C:/Users/91934/OneDrive/Desktop/mini_project/src/images/image3.jpeg";
import './Carousels.css'; // Ensure this import is present

const images = [
  logoImage,
  imageImage,
  image1Image
];

function Carousels() {
  return (
    <div className="carousel-container">
      <Carousel 
        showArrows={true}
        showStatus={true}
        showThumbs={false}
        showIndicators={true}
        autoPlay={true}
        interval={2000}
        infiniteLoop={true}
        stopOnHover={false}
        renderThumbs={() => null}
      >
        {images.map((URL, index) => (
          <div 
            className="slide" 
            key={index} 
            style={{ height: '40%' }} // Set container height to 40%
          >
            <img 
              alt={`Slide ${index + 1}`} 
              src={URL} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Ensure image fills container
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carousels;
