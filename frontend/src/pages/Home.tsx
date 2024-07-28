import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { WIDTH } from "../game/constants";
import { pad } from "../game/padding";
import { Simulate } from "../components/Simulate";
import { Quotes, FoundIssue } from "../components";
import MineSimulation from "../components/MineSimulation";

export function Home() {
  const canvasRef = useRef<any>();
  let [, setOutputs] = useState<{ [key: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
  });

  async function simulate(ballManager: BallManager) {
    let i = 0;
    while (1) {
      i++;
      ballManager.addBall(
        pad(WIDTH / 2 + 20 * (Math.random() - 0.5)),
        () => {}
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        1,
        (index: number, startX?: number) => {
          setOutputs((outputs: any) => {
            return {
              ...outputs,
              [index]: [...(outputs[index] as number[]), startX],
            };
          });
        }
      );
      simulate(ballManager);

      return () => {
        ballManager.stop();
      };
    }
  }, [canvasRef]);

  return (
    <div className="pt-32 px-32 ">
      <div className="flex flex-col lg:flex-row  items-center justify-between ">
        <Quotes
          heading="Mines : The Game Where Your Luck Goes to Take a Nap!"
          description={` Welcome to Mines, where your money is as safe as a snowman in a sauna! Think you can outsmart the mines and walk away with imaginary riches? Think again! This game is perfect for those who love the thrill of losing it all without the pesky reality of actual bankruptcy. Step right up, test your (questionable) luck, and see if you can turn your pretend fortune into a spectacular disaster. Warning: side effects may include uncontrollable laughter, mock crying, and a sudden urge to rethink your life choices. Dive in and explode with fun!`}
          action={{ text: "Play Mines", path: "/game/mines" }}
        />
        <MineSimulation />
      </div>
      <div className="flex flex-col lg:flex-row  items-center justify-between ">
        <Simulate />
        <Quotes
          action={{ text: "Play Pinkoo", path: "/game/plinkoo" }}
          heading="Plinko: Where Your  Money Learns to Fly... Away!"
          description={`Welcome to Plinko, where your imaginary wealth goes on a thrilling adventure towards bankruptcy! Drop a chip and marvel as it navigates a labyrinth of pegs with the grace of a drunken squirrel. Will you hit the jackpot? Sure, if the jackpot is the furthest point from financial success! It’s the perfect game for those who enjoy the thrill of watching their pretend riches take a scenic route to oblivion. Ready to witness the breathtaking spectacle of your fake fortune making a daring escape? Let’s Plinko and see how fast you can turn pretend money into pure amusement!`}
        />
      </div>
      <FoundIssue />
    </div>
  );
}
