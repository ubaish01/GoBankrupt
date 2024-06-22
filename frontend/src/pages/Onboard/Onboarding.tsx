import { useState } from "react";
import { Button } from "../../components/ui";
import { AVATAR, billionaires } from "../../game/constants";
import clsx from "clsx";
import { postRequest } from "../../services/Request";
import { AUTH } from "../../services/URL";
import { useDispatch } from "react-redux";
import { user, wallet } from "../../redux/user/userSlice";

const Onboarding = () => {
  const [avatar, setAvatar] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const TriggerOnboard = async () => {
    try {
      setLoading(true);
      const res = await postRequest(AUTH.ONBOARDING, { avatar });
      dispatch(user(res?.data?.user));
      dispatch(wallet(res?.data?.wallet));
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start items-center h-screen ">
      <div className="w-[40rem] bg-[#262522] h-fit my-8 gap-4  rounded-md flex-col px-24 flex items-center justify-center py-8">
        <h1 className="text-2xl">
          Welcome, <span className="font-bold text-purple-700">Ubaish</span>
        </h1>
        <div>Select a billionaire to play with his money</div>
        <BillionairesList />
        <SelectAvatar avatar={avatar} setAvatar={setAvatar} />
        <Button
          loading={loading}
          onClick={TriggerOnboard}
          className="bg-purple-700 px-4 py-2"
        >
          Start Playing
        </Button>
      </div>
      <div />
    </div>
  );
};

const BillionairesList = () => {
  return (
    <div className="relative h-10 w-full min-w-[200px]">
      <select className="peer h-full capitalize w-full rounded-[7px] border bg-transparent text-white  border-t-transparent  px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200   focus:border-2  focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
        {billionaires?.map((b) => (
          <option key={b._id} className="text-black  " value={b._id}>
            {b.name}
          </option>
        ))}
      </select>
      <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight  transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l  before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r  after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight  peer-focus:before:border-t-2 peer-focus:before:border-l-2  peer-focus:after:border-t-2 peer-focus:after:border-r-2  peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
        Select a billionaire
      </label>
    </div>
  );
};

const SelectAvatar = ({
  avatar,
  setAvatar,
}: {
  avatar: number;
  setAvatar: (k: number) => void;
}) => {
  return (
    <div className="w-full">
      <div className="text-xl font-semibold  ">
        Select an avatar<span className="text-red-500"> *</span>
      </div>
      <div className="w-full max-h-96 grid grid-cols-3 overflow-auto gap-4 mt-4 scrollbar-hidden   ">
        {Object.keys(AVATAR)?.map((key, index) => (
          <img
            onClick={() => {
              setAvatar(Number(key));
            }}
            key={index}
            className={clsx(
              "aspect-square  rounded-full  col-span-1 cursor-pointer p-1   object-cover active:scale-95",
              avatar == Number(key)
                ? "bg-purple-500"
                : "bg-black hover:bg-purple-200"
            )}
            src={AVATAR[Number(key)]}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
