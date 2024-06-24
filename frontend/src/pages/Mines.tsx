import clsx from "clsx";
import loader from "../assets/loaders/spinner.svg";
import { Balance } from "../helper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui";
import { getRequest, postRequest } from "../services/Request";
import { FaBitcoin } from "react-icons/fa";
import { BOX_STATE, Max_MINES } from "../game/constants";
import { wallet as setWallet } from "../redux/user/userSlice";

import gem from "../assets/GameIcons/gem.png";
import mine from "../assets/GameIcons/mine.png";
import toast from "react-hot-toast";
import { MINES } from "../services/URL";
import Select from "../components/ui/Select";
import { PiBankBold } from "react-icons/pi";

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

const initialState = Array.from({ length: 5 }, () =>
  Array(5).fill(BOX_STATE.UNKNOWN)
);

const Mines = () => {
  const [betAmount, setBetAmount] = useState(10);
  const { wallet } = useSelector((state: any) => state.ROOT);
  const [game, setGame] = useState<gameType>({ state: initialState });
  const [loading, setLoading] = useState({
    game: false,
    cashout: false,
  });
  const [revealing, setRevealing] = useState<number[] | null>(null);
  const [mines, setMines] = useState({ label: 3, value: 3 });

  const dispatch = useDispatch();

  const startGame = async () => {
    setLoading({ ...loading, game: true });
    try {
      const data = { betAmount: betAmount * 100, mines: mines.value };
      const res = await postRequest(MINES.START, data);

      if (res.data.success) {
        setGame(res.data.game);
        dispatch(setWallet(res.data.wallet));
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, game: false });
    }
  };

  const CheckActiveGame = async () => {
    setLoading({ ...loading, game: true });
    try {
      const res = await getRequest(MINES.CHECK_ACTIVE_GAME);
      if (res.data.success) {
        setGame(res.data.game);
        dispatch(setWallet(res.data.wallet));
      } else {
        // toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, game: false });
    }
  };

  const restartGame = () => {
    setTimeout(() => {
      setGame({ state: initialState });
      setBetAmount(10);
      setLoading({ cashout: false, game: false });
    }, 5000);
  };

  const revealBox = async (row: number, col: number) => {
    if (
      game.state[row][col] != BOX_STATE.UNKNOWN ||
      !game.isActive ||
      revealing
    )
      return;
    setRevealing([row, col]);
    try {
      const data = { row, col };
      const res = await postRequest(MINES.REVEAL_BOX, data);

      if (res.data.success) {
        setGame(res.data.game);
        if (!res.data.game.isActive) {
          toast.error("You lost the game");
          restartGame();
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRevealing(null);
    }
  };

  const cashout = async () => {
    setLoading({ ...loading, cashout: true });
    try {
      const data = {};
      const res = await postRequest(MINES.CASHOUT, data);

      if (res.data.success) {
        setGame(res.data.game);
        dispatch(setWallet(res.data.wallet));
        toast.success(
          `Cashout  $${Balance(
            Number(game.betAmount) * Number(game.multiplier)
          )}`
        );
        restartGame();
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, cashout: false });
    }
  };

  useEffect(() => {
    CheckActiveGame();
  }, []);

  return (
    <div className="flex  items-start pt-12  justify-center bg-[#0F212E]  w-full">
      <div className="w-72 h-[30rem] mt-16 px-4 gap-6 flex items-center justify-start pt-12 flex-col rounded-md bg-[#213743]">
        {/* BET AMOUNT  */}
        <div className="w-full relative">
          <div className="text-sm absolute top-[-1.3rem] left-0 pl-1 text-gray-400">
            Bet Amount
          </div>
          <input
            className={clsx(
              " px-4 disabled:bg-[#121212] py-3 rounded-md w-full "
            )}
            placeholder="Bet amount in USD"
            disabled={game && game.isActive}
            value={betAmount}
            type="number"
            onChange={(e: any) => {
              if (e.target.value < 0) return;
              console.log(typeof e.target.value);
              setBetAmount(
                Number(e.target.value) > Number(Balance(wallet.balance))
                  ? Number(Balance(wallet.balance))
                  : Number(e.target.value)
              );
            }}
          />
          <div className="absolute right-4 text-gray-400 top-1/2 -translate-y-1/2">
            $
          </div>
        </div>

        {/* SELECT BET RISK  */}
        <div className="w-full">
          {game && game.isActive ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1 relative ">
                <div className="text-sm absolute top-[-1.3rem] left-0 pl-1 text-gray-400">
                  Mines
                </div>
                <input
                  className={clsx(
                    "disabled:bg-[#121212] px-4 py-3 rounded-md w-full "
                  )}
                  disabled={true}
                  value={game?.mines || 0}
                  type="number"
                />
              </div>
              <div className="col-span-1 relative ">
                <div className="text-sm absolute top-[-1.3rem] left-0 pl-1 text-gray-400">
                  Gems
                </div>
                <input
                  className={clsx(
                    "disabled:bg-[#121212] px-4 py-3 rounded-md w-full "
                  )}
                  disabled={true}
                  value={Number(game?.gems) - Number(game?.opened) || 0}
                  type="number"
                />
              </div>
            </div>
          ) : (
            <Select
              value={mines}
              setValue={setMines}
              options={Array.from({ length: Max_MINES }, (_, i) => ({
                label: i + 1,
                value: i + 1,
              }))}
              label="Select mines"
            />
          )}
        </div>

        {/* PROFIT  */}
        {game && game.isActive && (
          <div className="w-full relative">
            <div className="text-sm absolute top-[-1.3rem] left-0 pl-1 text-gray-400">
              Total Profit ({game?.multiplier || 1}x)
            </div>
            <input
              className={clsx(
                " px-4 disabled:bg-[#121212] py-3 rounded-md w-full "
              )}
              disabled={true}
              value={Balance(Number(game.betAmount) * Number(game.multiplier))}
              type="number"
            />
            <div className="absolute right-4 text-gray-400 top-1/2 -translate-y-1/2">
              $
            </div>
          </div>
        )}

        {game && game.isActive ? (
          <Button
            className="px-10 mt-[-12px] bg-green-500 hover:bg-green-600 w-full justify-center active:scale-95 flex items-center gap-2"
            onClick={cashout}
            loading={loading.cashout}
          >
            Cashout <PiBankBold />
          </Button>
        ) : (
          <Button
            className="px-10 mb-0 bg-purple-500 hover:bg-purple-600 w-full justify-center active:scale-95 flex items-center gap-2"
            onClick={startGame}
            disabled={game && game.isActive}
            loading={loading.game}
          >
            Bet <FaBitcoin />
          </Button>
        )}
      </div>

      <div className="px-12 py-16 h-full">
        <div className=" w-[30rem] items-center justify-center h-full grid grid-cols-5 gap-2">
          {game.state.map((row, i) =>
            row.map((box, j) => (
              <div
                onClick={() => {
                  revealBox(i, j);
                }}
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
                      game?.privateState?.[i]?.[j] == BOX_STATE.MINE
                        ? mine
                        : gem
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
    </div>
  );
};

export default Mines;
