import React, { useState, useEffect, useRef } from "react";
import "./success.css";

// New video links for 3 separate students
const testimonials = [
  {
    name: "Rohit Sharma",
    course: "Technical Analysis",
    video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    text: "C&C's technical analysis course gave me the confidence to trade successfully. The hands-on practice and mentorship are unmatched!",
  },
  {
    name: "Anjali Mehta",
    course: "Fundamental Analysis",
    video: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    text: "The institute's approach to fundamental analysis was eye-opening. I landed my first analyst job thanks to these skills.",
  },
  {
    name: "Suresh Kumar",
    course: "Futures & Options",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    text: "Learning F&O from C&C helped me manage risk in my business and trading. Highly recommended for every aspiring trader.",
  },
];

const AUTO_SLIDE_DELAY = 15000; // 15 seconds

const Success = () => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, AUTO_SLIDE_DELAY);

    videoRefs.current.forEach((video, idx) => {
      if (video) {
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

  return (
    <section className="success-main">
      <div className="success-wrapper">
        <h2 className="success-heading">🎓 Student Success Stories</h2>

        <div className="testimonial-row">
          {/* Left: Text */}
          <div className="testimonial-text">
            <h3>{testimonials[current].name}</h3>
            <p className="course">({testimonials[current].course})</p>
            <p className="review">"{testimonials[current].text}"</p>
          </div>

          {/* Right: Video */}
          <div className="testimonial-video-wrapper">
            <video
              ref={(el) => (videoRefs.current[current] = el)}
              className="testimonial-video"
              controls={false}
              muted
              playsInline
              preload="auto"
              poster="https://images.unsplash.com/photo-1581093588401-12b66ade986d?auto=format&fit=crop&w=600&q=80"
            >
              <source src={testimonials[current].video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="success-dots">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`success-dot${idx === current ? " active" : ""}`}
              onClick={() => setCurrent(idx)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Success;
