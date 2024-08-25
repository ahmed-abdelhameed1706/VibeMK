import { CheckCircle, XCircle } from "lucide-react";

export const PasswordCriteria = ({ password, confirmPassword }) => {
  const criteria = [
    { label: "At least 6 characters ", met: password.length >= 6 },
    { label: "Contains lowercase character ", met: /[a-z]/.test(password) },
    { label: "Contains uppercase character ", met: /[A-Z]/.test(password) },
    { label: "Contains number ", met: /[0-9]/.test(password) },
    {
      label: "Contains special character ",
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      label: "Passwords match ",
      met: password === confirmPassword && password,
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 mr-2 text-gray-500" />
          )}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password, confirmPassword }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length > 5) {
      strength += 1;
    }
    if (password.length > 7) {
      strength += 1;
    }
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 1;
    }
    if (/[0-9]/.test(password)) {
      strength += 1;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    }
    return strength;
  };

  const strength = getStrength(password);

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-green-400";
      case 5:
        return "bg-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2 ">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/5 rounded-full transition-colors duration-300 ${
              index < strength ? getColor(strength) : "bg-gray-600"
            }`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} confirmPassword={confirmPassword} />
    </div>
  );
};

export default PasswordStrengthMeter;
