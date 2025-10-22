import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Baner = () => {
  const time = new Date().getHours();
  const userName = useAuthStore((state) => state.user?.userName);

  const greeting = () => {
    if (time < 10) return "pagi";
    if (time < 15) return "siang";
    if (time < 18) return "sore";
    return "malam";
  }

  useEffect(() => {
    greeting();
  }, [time]);
  return (
    <section className="h-60 w-full bg-gradient-to-r from-[#5562D5] to-[#343B75] rounded-bl-full">
      <section className="pl-32 lg:pl-52 py-10 flex flex-col gap-4">
        <h1 className="first-letter:uppercase font-poppins text-white text-4xl lg:text-5xl font-medium">
          halo, {userName}
        </h1>
        <h2 className="pr-14 first-letter:uppercase font-poppins text-white text-xl lg:text-2xl font-light">selamat {greeting()}, selamat datang di dashboard, mau apa hari ini?</h2>
      </section>
    </section>
  );
};

export default Baner;
