import { BsFillGridFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  setOpen: any;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <section className="h-screen fixed z-10">
      <ul
        className="menu h-full bg-white shadow-xl rounded-box w-fit gap-4 flex flex-col px-4 py-5"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <li
          className={`rounded-md bg-gradient-to-r from-[#5460d1] to-[#4954b6] w-12 h-12 flex justify-center transition-all duration-300 ease-in-out ${
            open ? "w-40" : ""
          }`}
        >
          <a onClick={() => navigate("/")} className="text-white">
            <BsFillGridFill className="text-2xl" />
            <p className={open ? "" : "hidden"}>Dashboard</p>
          </a>
        </li>
        <li
          className={`rounded-md bg-gradient-to-r from-[#5460d1] to-[#4954b6] w-12 h-12 flex justify-center transition-all duration-300 ease-in-out ${
            open ? "w-40" : ""
          }`}
        >
          <a onClick={() => navigate("/users")} className="text-white">
            <FaUsers className="text-2xl" />
            <p className={open ? "" : "hidden"}>Users</p>
          </a>
        </li>
        <li
          className={`rounded-md bg-gradient-to-r from-[#5460d1] to-[#4954b6] w-12 h-12 flex justify-center transition-all duration-300 ease-in-out ${
            open ? "w-40" : ""
          }`}
        >
          <a className="text-white" onClick={() => navigate("/sheets")}>
            <RiFileExcel2Line className="text-2xl" />
            <p className={open ? "" : "hidden"}>Sheets</p>
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
