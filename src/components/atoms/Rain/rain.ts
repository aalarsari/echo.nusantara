if (typeof document !== "undefined") {
  let canvas = document.getElementsByClassName("rain")[0] as
    | HTMLCanvasElement
    | undefined;

  if (canvas) {
    let c = canvas.getContext("2d")!;

    const randomNum = function (max: number, min: number): number {
      return Math.floor(Math.random() * max) + min;
    };

    class RainDrops {
      x: number;
      y: number;
      endy: number;
      velocity: number;
      opacity: number;

      constructor(
        x: number,
        y: number,
        endy: number,
        velocity: number,
        opacity: number,
      ) {
        this.x = x;
        this.y = y;
        this.endy = endy;
        this.velocity = velocity;
        this.opacity = opacity;
      }

      draw(): void {
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, this.y - this.endy);
        c.lineWidth = 1;
        c.strokeStyle = "rgba(255, 255, 255, " + this.opacity + ")";
        c.stroke();
      }

      update(): void {
        let rainEnd = window.innerHeight + 100;
        if (this.y >= rainEnd) {
          this.y = this.endy - 100;
        } else {
          this.y = this.y + this.velocity;
        }
        this.draw();
      }
    }

    let rainArray: RainDrops[] = [];

    for (let i = 0; i < 140; i++) {
      let rainXLocation = Math.floor(Math.random() * window.innerWidth) + 1;
      let rainYLocation = Math.random() * -500;
      let randomRainHeight = randomNum(10, 2);
      let randomSpeed = randomNum(20, 0.2);
      let randomOpacity = Math.random() * 0.55;
      rainArray.push(
        new RainDrops(
          rainXLocation,
          rainYLocation,
          randomRainHeight,
          randomSpeed,
          randomOpacity,
        ),
      );
    }

    const animateRain = function (): void {
      requestAnimationFrame(animateRain);
      c.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < rainArray.length; i++) {
        rainArray[i].update();
      }
    };

    animateRain();
  } else {
    console.error("Elemen canvas dengan kelas 'rain' tidak ditemukan.");
  }
}
