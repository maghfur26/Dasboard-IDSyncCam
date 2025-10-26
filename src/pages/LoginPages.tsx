import { FaArrowRight, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import loginSchema from "../validations/loginValidation";
import { useAuthStore } from "../store/useAuthStore";

function LoginPages() {
  const [hidden, setHidden] = useState<boolean>(true);
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );

  const navigate = useNavigate();

  // Ambil dari Zustand store
  const { isAuthenticated, loading, error, login, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    // Validasi form dengan Joi
    const { error: validationError } = loginSchema.validate({
      email: formData.email,
      password: formData.password,
    });

    if (validationError) {
      return;
    }

    try {
      // Login akan otomatis set cookies dari backend
      await login(formData.email, formData.password);

      // Check role setelah login berhasil
      const user = await useAuthStore.getState().user;

      if (
        user?.role !== "ADMIN" &&
        user?.role !== "admin" &&
        user?.role !== "Admin"
      ) {
        // Logout jika bukan admin
        await useAuthStore.getState().logout();
        // Set custom error (opsional: bisa tambahkan method setError di store)
        return;
      }

      // Redirect ke dashboard
      navigate("/", { replace: true });
    } catch (error: any) {
      // Error sudah di-handle di store
      console.error("Login failed:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) clearError();
  };

  // Redirect jika sudah authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="h-screen min-w-screen flex items-center justify-center bg-[#EAF0FF]">
      <div className="w-[70%] h-[768px] flex bg-white rounded-xl shadow-[4px_9px_8px_0px_rgba(0,0,0,0.25)]">
        <div className="w-[40%] bg-gradient-to-br from-[#1E4CB5] to-[#5561D3] rounded-tr-[120px] flex flex-col items-center justify-center">
          <img className="w-[40%] lg:w-[30%] mb-2" src={logo} alt="logo.png" />
          <h1 className="font-poppins text-white text-2xl text-center">
            Dinas Kependudukan Dan Pencatatan Sipil
          </h1>
        </div>

        <div className="grid place-content-center px-10">
          <h1 className="font-poppins font-extralight text-5xl mb-5">
            Selamat Datang
          </h1>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 font-poppins">
                Email
              </label>
              <input
                className="font-poppins text-md font-extralight outline-none border-[#e0dfdf] border-[1px] w-full max-w-[589px] h-[76px] px-4 rounded-md focus:border-[#5C6BF0] transition-colors"
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-2 font-poppins">
                Password
              </label>
              <input
                className="font-poppins text-md font-extralight outline-none border-[#e0dfdf] border-[1px] w-full max-w-[589px] h-[76px] px-4 rounded-md focus:border-[#5C6BF0] transition-colors"
                placeholder="Password"
                name="password"
                value={formData.password}
                type={hidden ? "password" : "text"}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button
                className="absolute cursor-pointer right-4 top-12 text-gray-600 hover:text-gray-800"
                type="button"
                onClick={() => setHidden(!hidden)}
                disabled={loading}
              >
                {hidden ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {/* Error Message dari Zustand Store */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Button dengan Loading State dari Store */}
            <button
              type="submit"
              disabled={!formData.email || !formData.password || loading}
              className={`mx-auto mt-10 text-2xl transition-all duration-300 ${
                !formData.email || !formData.password || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#5C6BF0] hover:text-[#4f5cd3] cursor-pointer hover:scale-110"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5C6BF0]" />
              ) : (
                <FaArrowRight />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPages;
