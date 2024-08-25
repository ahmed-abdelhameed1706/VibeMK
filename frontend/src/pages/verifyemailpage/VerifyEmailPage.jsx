import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const { verifyEmail, error, isLoading, resendVerificationEmail, user } =
    useAuthStore();
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timer, setTimer] = useState(0); // Timer state in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusedIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;

      inputRefs.current[focusedIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);

      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5 && code[index]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const verificationCode = code.map((c) => c.trim()).join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail(user.email);

      setIsResendDisabled(true);
      setTimer(120);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false); // Re-enable the button after the timer ends
    }
  }, [timer]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify your email
        </h2>
        <p className="text-gray-300 text-center mb-6">
          We have sent a verification code to your email. Please enter the code
          below.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(elem) => (inputRefs.current[index] = elem)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                // onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2
                border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                disabled={isSubmitting}
              />
            ))}
          </div>
          <div className="flex items-center mb-6">
            <button
              disabled={isResendDisabled}
              type="button"
              onClick={handleResendVerificationEmail}
              className={`text-sm text-green-400 hover:underline ${
                isResendDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isResendDisabled
                ? `Resend in ${timer}s`
                : "Resend Verification Code"}
            </button>
          </div>

          {error && <p className="text-red-500 text-semibold mt-2">{error}</p>}

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              <span>Validate Email</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
