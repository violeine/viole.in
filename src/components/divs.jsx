import { range } from "@/lib/mae";
import { useState } from "react";
import "tailwindcss/tailwind.css";

const Tau = 2 * Math.PI;
export const Cards = () => {
  const length = 72;
  const [play, setPlay] = useState(false);
  return (
    <div className="border border-slate-900 mx-auto">
      <button
        className="bg-green-200 px-5 py-2 rounded absolute left-[50%] bottom-5 -translate-x-1/2"
        onClick={() => setPlay(!play)}
      >
        start
      </button>
      <div
        key={play}
        className={`absolute -bottom-[200px] left-[50%] z-50 ${play ? "spin" : ""
          }`}
      >
        {range(length).map((rotation, _, a) => (
          <Card
            key={rotation}
            r={((rotation + 1) / a.length) * Tau + Tau / 4}
          />
        ))}
      </div>
    </div >
  );
};

const Card = ({ r }) => {
  const [play, setP] = useState(false);
  return (
    <>
      <div
        className={`absolute w-[150px] h-[200px] bg-slate-400 rounded-md border-slate-100 border-2 border-solid shadow card ${play ? "hover" : ""}`}
        onClick={() => setP(!play)}
        style={{
          left: `calc(50% - 75px)`,
          bottom: 0,
          transformOrigin: "bottom",
          transform: `rotate(${r}rad) translateY(calc(-100vh / 3 ))`,
          transition: "transform ease-in 0.3s",
        }}
      ></div>
    </>
  );
};
const normalize = (r) => (360 + (r % 360)) % 360;

const translate = (rotation) => {
  // const sinSign = [0, 1, 0, -1];
  // const cosSign = [1, 0, -1, 0];
  if (rotation === 0) return [0, -1];
  else if (rotation < 90) return [1, -1];
  else if (rotation === 90) return [1, -1];
  else if (rotation < 180) return [1, 1];
  else if (rotation === 180) return [0, -1];
  else if (rotation < 270) return [-1, 1];
  else if (rotation === 270) return [-1, -1];
  else if (rotation > 270) return [-1, -1];
};
