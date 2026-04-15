import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("input");
  const [seconds, setSeconds] = useState(0);
  const [baseSeconds, setBaseSeconds] = useState(0);

  const [input, setInput] = useState({
    dob: "",
    smoker: false,
    drinker: false,
    exercise: false,
    height: "",
    weight: "",
    sleep: 7,
    diet: "",
    stress: "",
  });

  // ================= CALCULATION =================
  const calculateTime = () => {
    const birthDate = new Date(input.dob);
    const now = new Date();

    const age =
      (now - birthDate) / (1000 * 60 * 60 * 24 * 365);

    let lifeExpectancy = 72;

    // Lifestyle
    if (input.smoker) lifeExpectancy -= 8;
    if (input.drinker) lifeExpectancy -= 3;
    if (input.exercise) lifeExpectancy += 4;

    // BMI
    if (input.height && input.weight) {
      const h = input.height / 100;
      const bmi = input.weight / (h * h);

      if (bmi > 30) lifeExpectancy -= 4;
      else if (bmi < 18.5) lifeExpectancy -= 2;
    }

    // Sleep
    if (input.sleep < 6) lifeExpectancy -= 3;
    if (input.sleep >= 7 && input.sleep <= 8) lifeExpectancy += 2;

    // Diet
    if (input.diet === "good") lifeExpectancy += 3;
    if (input.diet === "poor") lifeExpectancy -= 3;

    // Stress
    if (input.stress === "high") lifeExpectancy -= 4;
    if (input.stress === "low") lifeExpectancy += 2;

    const remainingYears = lifeExpectancy - age;
    const sec = Math.max(remainingYears * 365 * 24 * 60 * 60, 0);

    setSeconds(sec);
    setBaseSeconds(sec);
    setPage("result");
  };

  // ================= TIMER =================
  useEffect(() => {
    if (page !== "result") return;

    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [page]);

  const format = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return { d, h, m, sec };
  };

  const { d, h, m, sec } = format(seconds);

  // Progress
  const totalLife = 80 * 365 * 24 * 60 * 60;
  const used = totalLife - baseSeconds;
  const percent = Math.min((used / totalLife) * 100, 100);

  // Share
  const share = () => {
    const text = `I have ${Math.floor(
      seconds / 1e6
    )} million seconds left. What about you?`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  // ================= INPUT PAGE =================
  if (page === "input") {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl w-full max-w-sm">

          <h1 className="text-2xl mb-6 text-center">
            Your Life Clock
          </h1>

          {/* DOB */}
          <input
            type="date"
            className="w-full p-3 mb-4 bg-black border border-white/20 rounded"
            onChange={(e) =>
              setInput({ ...input, dob: e.target.value })
            }
          />

          {/* Height & Weight */}
          <input
            type="number"
            placeholder="Height (cm)"
            className="w-full p-3 mb-3 bg-black border border-white/20 rounded"
            onChange={(e) =>
              setInput({ ...input, height: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            className="w-full p-3 mb-4 bg-black border border-white/20 rounded"
            onChange={(e) =>
              setInput({ ...input, weight: e.target.value })
            }
          />

          {/* Sleep */}
          <label className="text-sm mb-1 block">
            Sleep: {input.sleep} hrs
          </label>
          <input
            type="range"
            min="4"
            max="10"
            value={input.sleep}
            className="w-full mb-4"
            onChange={(e) =>
              setInput({ ...input, sleep: e.target.value })
            }
          />

          {/* Diet */}
          <select
            className="w-full p-3 mb-4 bg-black border border-white/20 rounded"
            onChange={(e) =>
              setInput({ ...input, diet: e.target.value })
            }
          >
            <option value="">Diet Quality</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>

          {/* Stress */}
          <select
            className="w-full p-3 mb-4 bg-black border border-white/20 rounded"
            onChange={(e) =>
              setInput({ ...input, stress: e.target.value })
            }
          >
            <option value="">Stress Level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Toggles */}
          <label className="flex justify-between mb-2">
            Smoking
            <input
              type="checkbox"
              onChange={(e) =>
                setInput({ ...input, smoker: e.target.checked })
              }
            />
          </label>

          <label className="flex justify-between mb-2">
            Alcohol
            <input
              type="checkbox"
              onChange={(e) =>
                setInput({ ...input, drinker: e.target.checked })
              }
            />
          </label>

          <label className="flex justify-between mb-6">
            Exercise
            <input
              type="checkbox"
              onChange={(e) =>
                setInput({ ...input, exercise: e.target.checked })
              }
            />
          </label>

          <button
            onClick={calculateTime}
            className="w-full py-3 bg-white text-black rounded hover:scale-105 transition"
          >
            See My Time
          </button>
        </div>
      </div>
    );
  }

  // ================= RESULT PAGE =================
  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <p className="text-xs tracking-[0.3em] opacity-50">
        YOUR LIFE CLOCK
      </p>

      <h1 className="text-6xl md:text-7xl font-mono mt-6 text-center">
        {d}d {h}h {m}m {sec}s
      </h1>

      {/* Progress */}
      <div className="w-full max-w-xl mt-10">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-center mt-3 text-sm opacity-60">
          {percent.toFixed(1)}% of your life used
        </p>
      </div>

      {/* Insight */}
      <p className="mt-6 text-sm opacity-60 text-center">
        Small changes in habits can add years to your life.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setPage("input")}
          className="px-4 py-2 border rounded hover:bg-white hover:text-black transition"
        >
          Restart
        </button>

        <button
          onClick={share}
          className="px-4 py-2 bg-white text-black rounded hover:scale-105 transition"
        >
          Share
        </button>
      </div>

      <p className="mt-10 text-sm opacity-50 italic">
        “Make it count.”
      </p>
    </div>
  );
}