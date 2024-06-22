import { HEIGHT, WIDTH, ballRadius, obstacleRadius } from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";

export class BallManager {
  private balls: Ball[];
  private canvasRef: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private obstacles: Obstacle[];
  private sinks: Sink[];
  private requestId?: number;
  private onFinish?: (index: number, startX?: number) => void;

  constructor(
    canvasRef: HTMLCanvasElement,
    risk: number,
    onFinish?: (index: number, startX?: number) => void
  ) {
    this.balls = [];
    this.canvasRef = canvasRef;
    this.ctx = this.canvasRef.getContext("2d")!;
    this.obstacles = createObstacles();
    this.sinks = createSinks(risk);
    this.update();
    this.onFinish = onFinish;
  }

  addBall(startX: number = 4095298.638700827, cb: any) {
    const newBall = new Ball(
      startX || pad(WIDTH / 2 + 13),
      pad(50),
      ballRadius,
      "red",
      this.ctx,
      this.obstacles,
      this.sinks,
      (index) => {
        this.balls = this.balls.filter((ball) => ball !== newBall);
        this.onFinish?.(index, startX);
        cb();
      }
    );
    this.balls.push(newBall);
  }

  drawObstacles() {
    this.ctx.fillStyle = "white";
    this.obstacles.forEach((obstacle) => {
      this.ctx.beginPath();
      this.ctx.arc(
        unpad(obstacle.x),
        unpad(obstacle.y),
        obstacle.radius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  getColor(index: number) {
    if (index < 3 || index > this.sinks.length - 3) {
      return { background: "#ff003f", color: "white" };
    }
    if (index < 6 || index > this.sinks.length - 6) {
      return { background: "#ff7f00", color: "white" };
    }
    if (index < 9 || index > this.sinks.length - 9) {
      return { background: "#ffbf00", color: "black" };
    }
    if (index < 12 || index > this.sinks.length - 12) {
      return { background: "#ffff00", color: "black" };
    }
    if (index < 15 || index > this.sinks.length - 15) {
      return { background: "#bfff00", color: "black" };
    }
    return { background: "#7fff00", color: "black" };
  }

  drawSinks() {
    const SPACING = obstacleRadius * 2;
    const BORDER_RADIUS = 6; // Set the border radius
    const ADDITIONAL_WIDTH = 4; // Define the additional width
    const ADDITIONAL_SPACING = 0; // Define the additional spacing between sinks on x-axis

    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      const x = sink.x + i * ADDITIONAL_SPACING; // Increase the gap between sinks on x-axis
      const y = sink.y - sink.height / 2;
      const width = sink.width - SPACING + ADDITIONAL_WIDTH; // Increase the width
      const height = sink.height;

      // Set the fill style for the sink background
      this.ctx.fillStyle = this.getColor(i).background;

      // Draw the sink rectangle with rounded corners
      this.ctx.beginPath();
      this.ctx.moveTo(x + BORDER_RADIUS, y);
      this.ctx.lineTo(x + width - BORDER_RADIUS, y);
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + BORDER_RADIUS);
      this.ctx.lineTo(x + width, y + height - BORDER_RADIUS);
      this.ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - BORDER_RADIUS,
        y + height
      );
      this.ctx.lineTo(x + BORDER_RADIUS, y + height);
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - BORDER_RADIUS);
      this.ctx.lineTo(x, y + BORDER_RADIUS);
      this.ctx.quadraticCurveTo(x, y, x + BORDER_RADIUS, y);
      this.ctx.closePath();
      this.ctx.fill();

      // Set the fill style for the text
      this.ctx.fillStyle = this.getColor(i).color;

      // Set the font style
      this.ctx.font = "normal 13px Arial";
      this.ctx.textAlign = "center"; // Align text horizontally center
      this.ctx.textBaseline = "middle"; // Align text vertically center

      // Draw the multiplier text
      this.ctx.fillText(
        sink?.multiplier?.toString() + "x",
        x + width / 2, // Center horizontally
        sink.y // Center vertically
      );
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.drawObstacles();
    this.drawSinks();
    this.balls.forEach((ball) => {
      ball.draw();
      ball.update();
    });
  }

  update() {
    this.draw();
    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }
}
