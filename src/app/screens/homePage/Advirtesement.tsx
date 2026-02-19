import React from "react";

// Advertisement sec comp uchun functional komponent
export default function Advertisement() {
  return (
    // Ushbu comp faqat divdan iborat sababoi umumiy widthni egalashi kerak
    <div className="ads-restaurant-frame">
      <video
        className={"ads-video"}
        autoPlay={true}
        loop
        muted
        playsInline
        data-video-media=""
      >
        <source type="video/mp4" src="video/burak-ads.mp4" />
      </video>
    </div>
  );
}