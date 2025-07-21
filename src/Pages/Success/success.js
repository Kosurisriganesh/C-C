import React, { useState, useEffect, useRef } from "react";
import "./success.css";

const testimonials = [
  {
    name: "K.NAGESHWARA RAO",
    course:"FUTURES & OPTIONS",
    video: "https://www.youtube.com/shorts/n3_PFByO2zM",
    text:  "C&C's Futures & Options course simplified complex trading concepts with real-world strategies. It gave me the tools to hedge risk and profit confidently in volatile markets.",
    rating: 5,
  },
  {
    name: "Anjali Mehta",
    course: "Fundamental Analysis",
    video: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    text: "The institute's approach to fundamental analysis was eye-opening. I landed my first analyst job thanks to these skills.",
    rating: 4,
  },
  {
    name: "Suresh Kumar",
    course: "Futures & Options",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    text: "Learning F&O from C&C helped me manage risk in my business and trading. Highly recommended for every aspiring trader.",
    rating: 5,
  },
];

const AUTO_SLIDE_DELAY = 15000;

const Success = () => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, AUTO_SLIDE_DELAY);

    testimonials.forEach((t, idx) => {
      const isYouTube = t.video.includes("youtube.com");
      const video = videoRefs.current[idx];

      if (!isYouTube && video) {
        if (idx === current) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    return () => clearTimeout(timer);
  }, [current]);

  const handleVideoClick = (index, isYouTube) => {
    if (isYouTube) return;
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false;
      video.play().catch(() => {});
    }
  };

  const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

  const getYouTubeEmbedURL = (url) => {
    let videoId = "";
    if (url.includes("shorts")) {
      videoId = url.split("/shorts/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    // Removed autoplay and mute for sound
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  };

  return (
    <section className="success-main">
      <div className="success-wrapper">
        <h2 className="success-heading">🎓 Student Success Stories</h2>

        <div
          className="testimonial-slider"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t, idx) => {
            const isYouTube = t.video.includes("youtube.com");

            return (
              <div className="testimonial-row" key={idx}>
                <div className="testimonial-text">
                  <h3>{t.name}</h3>
                  <p className="course">({t.course})</p>
                  <p className="review">"{t.text}"</p>
                  <p className="rating">{renderStars(t.rating)}</p>
                </div>

                <div className="testimonial-video-wrapper">
                  {isYouTube ? (
                    <iframe
                      className="testimonial-video"
                      src={getYouTubeEmbedURL(t.video)}
                      title={`YouTube video by ${t.name}`}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      ref={(el) => (videoRefs.current[idx] = el)}
                      className="testimonial-video"
                      controls={false}
                      muted
                      playsInline
                      preload="auto"
                      poster="https://images.unsplash.com/photo-1581093588401-12b66ade986d?auto=format&fit=crop&w=600&q=80"
                      onClick={() => handleVideoClick(idx, false)}
                    >
                      <source src={t.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="success-dots">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`success-dot ${idx === current ? "active" : ""}`}
              onClick={() => setCurrent(idx)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Success;
