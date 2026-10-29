import React from 'react';
import { ReactLenis } from 'lenis/react';

export default function StickyImageStack({ images }) {
  return (
    <ReactLenis root>
      <main className="bg-[#07090B]">
        <div className="wrapper">
          <section className="text-white h-screen w-full bg-[#07090B] grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <h1 className="text-3xl font-semibold text-center tracking-tight leading-[120%] text-white/90">
              Project Showcase
            </h1>
          </section>
        </div>

        <section className="text-white w-full bg-[#07090B]">
          <>
            {images.map((img, i) => {
              const offsets = [0, 2, 4, 6, 8, 12];
              const widths = ['55%', '60%', '65%', '70%', '75%', '80%'];
              return (
                <div key={i} className="sm:sticky sm:top-0 w-full" style={{ top: `${offsets[i] || 0}px` }}>
                  <figure className="w-full h-[60vh] flex items-center justify-center">
                    <img
                      src={img}
                      alt=""
                      className="transition-all duration-300 h-[80%] w-full md:w-[55%] align-bottom object-cover rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000]"
                      style={{ width: i < widths.length ? widths[i] : '55%' }}
                    />
                  </figure>
                </div>
              );
            })}
          </>
        </section>
      </main>
    </ReactLenis>
  );
}
