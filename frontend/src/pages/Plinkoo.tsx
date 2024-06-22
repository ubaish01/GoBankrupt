import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { Button } from "../components/ui";
import { baseURL } from "../utils";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { wallet as setWallet } from "../redux/user/userSlice";
import { postRequest } from "../services/Request";
import clsx from "clsx";
import Select from "../components/ui/Select";
import { FaBitcoin } from "react-icons/fa";
import { BET_RISK } from "../game/constants";
import { Balance } from "../helper";

export function Plinkoo() {
  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState({ label: "low", value: BET_RISK.LOW });
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>();
  const dispatch = useDispatch();
  const { wallet } = useSelector((state: any) => state.ROOT);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        risk.value
      );
      setBallManager(ballManager);
    }
  }, [canvasRef, risk]);

  return (
    <div className="flex  items-start  justify-center  w-full">
      <div className="w-72 h-[30rem] mt-16 px-2 gap-6 flex items-center justify-start pt-12 flex-col rounded-md bg-[#262522]">
        {/* SELECT BET RISK  */}
        <div className="w-full">
          <Select
            value={risk}
            setValue={setRisk}
            options={Object.keys(BET_RISK)?.map((item) => ({
              label: item?.toLowerCase(),
              //@ts-ignore
              value: BET_RISK[`${item}`],
            }))}
            label="Bet risk"
          />
        </div>

        {/* BET AMOUNT  */}
        <div className="w-full relative">
          <div className="text-sm absolute top-[-1.2rem] left-0 pl-1 text-gray-400">
            Bet Amount
          </div>
          <input
            className={clsx(" px-4 py-3 rounded-md w-full ")}
            placeholder="Bet amount in USD"
            value={
              betAmount > Number(Balance(wallet.balance))
                ? Number(Balance(wallet.balance))
                : betAmount
            }
            type="number"
            onChange={(e: any) => {
              setBetAmount(
                e.target.value > Balance(wallet.balance)
                  ? Balance(wallet.balance)
                  : e.target.value
              );
            }}
          />
          <div className="absolute right-4 text-gray-400 top-1/2 -translate-y-1/2">
            $
          </div>
        </div>

        <Button
          className="px-10 mb-4 bg-purple-500 active:scale-95 flex items-center gap-2"
          onClick={async () => {
            const response = await postRequest(
              `${baseURL}/api/v1/game/plinkoo`,
              {
                bet: betAmount * 100,
                risk: risk.value,
              }
            );
            if (ballManager) {
              ballManager.addBall(response.data.point, () => {
                const amount = Number(
                  (response.data.multiplier * betAmount - betAmount).toFixed(1)
                );
                if (amount >= 0) toast.success(`+${amount}$`);
                else toast.error(`- ${Math.abs(amount)}$`);
                dispatch(setWallet(response.data.wallet));
              });
            }
          }}
        >
          Bet <FaBitcoin />
        </Button>
      </div>
      <canvas ref={canvasRef} width="800" height="800"></canvas>
    </div>
  );
}
