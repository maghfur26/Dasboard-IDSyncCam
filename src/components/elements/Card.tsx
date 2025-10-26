interface CardProps {
  title: string;
  desc?: string;
  count: number;
  width: number;
  height: number;
  className?: string;
  countColor?: string;
}

const Card = ({ title, count, width, height, className, countColor, desc }: CardProps) => {
  return (
    <div className={`h-[${height}px] w-[${width}px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)] rounded-xl p-4 text-[#939393] font-poppins ${className}`}>
      <h1 className="font-extralight text-xl">{title}</h1>
      <h2 className={`text-center font-extralight text-3xl ${countColor}`}>{count}</h2>
      <h2 className="font-extralight text-md">{desc}</h2>
    </div>
  );
};

export default Card;
