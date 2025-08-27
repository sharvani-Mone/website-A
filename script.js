document.addEventListener("DOMContentLoaded", () => {
  // Switch pages
  const enterBtn = document.getElementById("enterBtn");
  const welcomePage = document.getElementById("welcome");
  const appPage = document.getElementById("app");

  enterBtn.addEventListener("click", () => {
    welcomePage.style.display = "none";
    appPage.style.display = "block";
  });

  // Music Visualizer
  const fileInput = document.getElementById("fileInput");
  const audio = document.getElementById("audio");
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = 400;

  let audioContext, analyser, source, bufferLength, dataArray;

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
    audio.play();

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      draw();
    }
  });

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enterBtn");
  const welcomePage = document.getElementById("welcome");
  const appPage = document.getElementById("app");
  const fileInput = document.getElementById("fileInput");
  const audio = document.getElementById("audio");
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  const toggleBtn = document.getElementById("toggleBtn");

  let mode = "bars"; // default mode
  let glowIntensity = 0;

  // 🎬 Switch Pages
  enterBtn.addEventListener("click", () => {
    welcomePage.classList.add("hidden");
    setTimeout(() => {
      welcomePage.style.display = "none";
      appPage.style.display = "block";
      setTimeout(() => appPage.classList.add("show"), 50);
    }, 1000);
  });

  // 🎵 Handle Audio Upload
  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      audio.src = fileURL;
      audio.load();
    }
  });

  // 🎶 Audio Visualizer Setup
  let audioContext, analyser, source, dataArray;

  audio.onplay = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
    draw();
  };

  // 🎨 Draw Visualizer
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    // 🔥 Background Glow Effect
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    glowIntensity = avg / 2;

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      100,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width
    );
    gradient.addColorStop(
      0,
      `rgba(255, ${100 + glowIntensity}, ${200 - glowIntensity}, 0.7)`
    );
    gradient.addColorStop(1, `rgba(0,0,0,1)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🎵 Draw the visualizer
    if (mode === "bars") {
      drawBars();
    } else {
      drawCircle();
    }
  }

  // 📊 Bar Visualizer
  function drawBars() {
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = `hsl(${i * 3}, 100%, 50%)`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "white";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  // 🔵 Circular Visualizer
  function drawCircle() {
    const radius = 120;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      const angle = (i / dataArray.length) * Math.PI * 2;
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(angle) * (radius + value / 2);
      const y2 = cy + Math.sin(angle) * (radius + value / 2);

      ctx.strokeStyle = `hsl(${i * 3}, 100%, 60%)`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsl(${i * 3}, 100%, 60%)`;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // 🔄 Toggle Mode
  toggleBtn.addEventListener("click", () => {
    mode = mode === "bars" ? "circle" : "bars";
    toggleBtn.textContent =
      mode === "bars" ? "Switch to Circle" : "Switch to Bars";
  });

  // 🖥 Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = 500;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
});
