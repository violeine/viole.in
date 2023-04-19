export function animate({ duration }, draw) {
  let frame;
  let elapsed = 0; //time start
  let lastTime = performance.now();

  (function loop() {
    frame = requestAnimationFrame(loop);
    const beginTime = performance.now();
    const dt = beginTime - lastTime;
    elapsed += dt;
    lastTime = beginTime;

    //restart the loop when elapsed exceed defined duration
    if (elapsed > duration) {
      elapsed = elapsed % duration; //wrap around duration
    }
    draw({
      elapsed,
      playhead: elapsed / duration, //normalize duration between 0..1
    });
  })();
  return () => {
    cancelAnimationFrame(frame);
  };
}

//TODO: create a set of function have the shape; 

// const (start, end) =>  (t) => Value Between Start End base on t
