import { FaUserCircle } from "react-icons/fa";


type CardProps = {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
};

function CardAddUser({
  type,
  name,
  placeholder,
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: CardProps) {
  return (
    <div className="w-[700px] h-[450px] lg:w-[1121px] lg:h-[677px] bg-white rounded-lg shadow-md p-6">
      <h1 className="font-poppins font-semibold text-xl">
        Tambah Pengguna Baru
      </h1>
      <div className="grid gap-4 place-content-center pt-6 h-full">
        <div className="mx-auto">
          <FaUserCircle className="text-6xl lg:text-8xl" />
        </div>
        <div className="mb-10">
          <input
            className="bg-slate-200 w-[500px] lg:w-[900px] lg:h-[79px] px-4 py-2 rounded-xl"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-pointer hover:bg-gray-500 transition-colors"
            >
              Kembali
            </button>
          )}
          <button
            onClick={onNext}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#353C78] to-[#5460D2] text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            {currentStep === totalSteps - 1 ? "Simpan" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardAddUser;