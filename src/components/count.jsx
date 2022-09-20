import React, { useState } from "react";

export default function ReactCount() {
  const [c, setC] = useState(0);
  return (
    <div>
      React Count <button onClick={() => setC(c + 1)}>clicks: {c}</button>
    </div>
  );
}
