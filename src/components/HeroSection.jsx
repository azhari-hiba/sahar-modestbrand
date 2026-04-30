import { useNavigate } from "react-router-dom";
import heroBanner from "../assets/hero-banner.jpeg"; 

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-full-style">
      <div 
        className="hero-banner-wrapper" 
        onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
      >
        <img 
          src={heroBanner} 
          alt="Sahar Modest Brand" 
          className="hero-main-img" 
        />
        {/* هاد الطبقة هي لي كتدير ديك الـ opacity الخفيفة */}
        <div className="hero-overlay"></div>
      </div>

      <style>{`
        .hero-full-style {
          width: 100%;
          padding: 0; /* حيدنا الـ padding باش تجي لاصقة ف الجناب */
          margin: 0;
          background: #fff;
        }

        .hero-banner-wrapper {
          width: 100%;
          position: relative; /* ضرورية باش الـ overlay يخدم */
          cursor: pointer;
          line-height: 0; /* كتحيد الفراغ الصغير لي كيكون تحت التصويرة */
          overflow: hidden;
        }

        .hero-main-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover; /* كتضمن أن الصورة تغطي العرض كامل */
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.03); /* opacity خفيفة بزاف (3%) تقدري تزيديها لـ 0.05 إيلا بغيتي */
          pointer-events: none; /* باش ما تحبسش الكليك */
        }

        /* حيدنا الـ border-radius والـ max-width باش تجي Full Width ف كاع الأجهزة */
        @media (max-width: 1024px) {
          .hero-full-style {
            padding: 0;
          }
        }

        @media (max-width: 768px) {
          .hero-full-style {
            padding: 0;
          }
        }
      `}</style>
    </section>
  );
}