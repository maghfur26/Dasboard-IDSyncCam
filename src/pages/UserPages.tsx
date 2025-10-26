import Table from "../components/elements/Table";
import { FaPlus } from "react-icons/fa";
import api from "../api/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import CardAddUser from "../components/elements/CardAddUser";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface CreateUserData {
  name: string;
  type: string;
  placeholder: string;
}

function UserPages() {
  const fetched = useRef(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { users, setUsers } = useUserStore();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const createUserData: CreateUserData[] = [
    {
      name: "userName",
      type: "text",
      placeholder: "Masukkan nama pengguna",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Masukkan email",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Masukkan password",
    },
    {
      name: "role",
      type: "text",
      placeholder: "Masukkan role user",
    },
  ];

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch {
      console.error("Failed to fetch users");
    }
  };

  const handleNext = () => {
    if (currentStep < createUserData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/create-user", formData);
      if (response.status === 201) {
        await fetchUsers();
        setFormData({ userName: "", email: "", password: "", role: "" });
        setIsOpen(false);
        setCurrentStep(0);

        Swal.fire({
          icon: "success",
          title: "Pengguna berhasil dibuat",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat pengguna";
      Swal.fire({
        icon: "error",
        title: "Gagal membuat pengguna",
        text: errorMessage,
      });
    }
  };

  const handleInputChange = (value: string) => {
    const filedName = createUserData[currentStep].name;
    setFormData({
      ...formData,
      [filedName]: value,
    });
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentStep(0);
    setFormData({ userName: "", email: "", password: "", role: "" });
  };

  const handleDeleteUser = async (id: string) => {
    // Cari user berdasarkan ID untuk konfirmasi
    const userToDelete = users.find((user) => user.id === id);

    // Konfirmasi sebelum delete
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      html: `
        <p>Anda akan menghapus:</p>
        <p><strong>Nama:</strong> ${userToDelete?.userName || "Unknown"}</p>
        <p><strong>Email:</strong> ${userToDelete?.email || "Unknown"}</p>
        <p><strong>ID:</strong> ${id}</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      console.log("❌ Delete dibatalkan"); // DEBUG
      return;
    }

    try {
      const response = await api.delete("/users/" + id);

      if (response.status === 204 || response.status === 200) {
        await fetchUsers();
        Swal.fire({
          icon: "success",
          title: "Pengguna berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal menghapus pengguna";
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus pengguna",
        text: errorMessage,
      });
    }
  };

  const currentData = createUserData[currentStep];
  const currentValue = formData[currentData.name as keyof typeof formData];

  useEffect(() => {
    if (!fetched.current) {
      fetchUsers();
      fetched.current = true;
    }
  }, []);

  return (
    <div className="relative">
      <header className="font-poppins font-extralight text-3xl mb-10 px-10 pt-10">
        <h1>Pengguna</h1>
      </header>
      <main className="px-10">
        <div
          className="mb-10 text-white bg-[#434B96] w-[162px] h-[60px] flex items-center justify-center rounded-md px-4 gap-2 hover:bg-[#515ECB] cursor-pointer transition-colors ease-in-out duration-300"
          onClick={() => setIsOpen(true)}
        >
          <FaPlus />
          <p className="font-poppins font-light text-sm">Tambah Pengguna</p>
        </div>
        <div>
          <Table
            thead={["Nama", "Email", "Role", "Aksi"]}
            tbody={users.map((user: User) => {
              return {
                Nama: user.userName,
                Email: user.email,
                Role: user.role,
                Aksi: user.id,
              };
            })}
            onClickDelete={handleDeleteUser}
          />
        </div>
      </main>
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black/50 grid place-content-center z-50">
          <div className="relative">
            <CardAddUser
              name={currentData.name}
              type={currentData.type}
              placeholder={currentData.placeholder}
              value={currentValue}
              onChange={handleInputChange}
              onNext={handleNext}
              onBack={currentStep > 0 ? handleBack : undefined}
              currentStep={currentStep}
              totalSteps={createUserData.length}
            />
            <div>
              <AiOutlineCloseCircle
                className="absolute -top-2 -right-4 cursor-pointer text-3xl text-red-400 bg-white rounded-full p-1 hover:text-red-600 transition-colors"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPages;
