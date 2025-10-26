import { useAuthStore } from "../../store/useAuthStore";

interface AvatarProps {
  onClick?: () => void;
}

const Avatar = ({ onClick }: AvatarProps) => {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <div className="w-full bg-white flex items-center justify-end px-4 py-2">
        <div className="avatar-container cursor-pointer flex items-center gap-2" onClick={onClick}>
          <div className="w-10 h-10 rounded-full flex-shrink-0">
            <img
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-poppins font-medium leading-tight">
              {user?.userName}
            </span>
            <p className="text-xs font-poppins font-extralight leading-tight">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Avatar;
