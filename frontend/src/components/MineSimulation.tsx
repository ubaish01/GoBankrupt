import { useEffect, useState } from "react";
import { BOX_STATE } from "../game/constants";
import clsx from "clsx";

import gem from "../assets/GameIcons/gem.png";
import mine from "../assets/GameIcons/mine.png";
import loader from "../assets/loaders/spinner.svg";
import { generateRandomNumber } from "../helper";

const initialState = {
  state: [
    [1, 1, 2, 2, 2],
    [1, 2, 2, 2, 1],
    [2, 2, 1, 1, 1],
    [1, 2, 1, 1, 2],
    [1, 2, 2, 1, 1],
  ],
  isActive: false,
};

type gameType = {
  _id?: string;
  mines?: number;
  gems?: number;
  isActive?: boolean;
  betAmount?: number;
  multiplier?: number;
  state: number[][];
  privateState?: number[][];
  opened?: number;
};

const MineSimulation = () => {
  const [game, setGame] = useState<gameType>(initialState);
  const [revealing, setRevealing] = useState<number[] | null>(null);

  const openRandomBox = () => {
    const row = generateRandomNumber(0, 4);
    const col = generateRandomNumber(0, 4);

    const val = generateRandomNumber(1, 2);
    if (game.state[row][col] == val) game.state[row][col] = 0;
    else game.state[row][col] = val;
    setGame({ ...game });
  };

  useEffect(() => {
    setInterval(() => {
      setGame(initialState);
    }, 60 * 1000);

    setInterval(() => {
      openRandomBox();
    }, 1000);

    setInterval(() => {
      const row = generateRandomNumber(0, 4);
      const col = generateRandomNumber(0, 4);
      setRevealing([row, col]);
    }, 7000);
  }, []);

  return (
    <div className="px-12 py-16 h-full">
      <div className=" w-[30rem] items-center justify-center h-full grid grid-cols-5 gap-2">
        {game.state.map((row, i) =>
          row.map((box, j) => (
            <div
              key={j}
              className={clsx(
                !game._id ||
                  (game.state[i][j] === BOX_STATE.UNKNOWN && game.isActive)
                  ? "bg-[#2F4553]  hover:scale-105 hover:bg-[#557086]"
                  : "bg-[#071824]",
                "  cursor-pointer  flex items-center justify-center aspect-square rounded-md p-4"
              )}
            >
              {revealing && revealing[0] === i && revealing[1] === j ? (
                <img src={loader} className="w-3/5" alt="" />
              ) : !game.isActive && game._id ? (
                <img
                  src={
                    game?.privateState?.[i]?.[j] == BOX_STATE.MINE ? mine : gem
                  }
                  className={clsx(
                    game?.privateState?.[i]?.[j] === game.state[i][j]
                      ? "brightness-100 w-full"
                      : "brightness-50 w-5/6"
                  )}
                  alt=""
                />
              ) : box !== BOX_STATE.UNKNOWN ? (
                <img src={box === BOX_STATE.GEM ? gem : mine} alt="" />
              ) : (
                <></>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MineSimulation;
