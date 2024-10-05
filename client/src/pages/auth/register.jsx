import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  avatar: "",
  password: "",
  confirmPassword: "",
  role: "",
  companyName: "",
  address: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Confirm password is incorrect");
      return;
    }

    // Validate for Recruiter fields
    if (formData.role === "Recruiter" && (!formData.companyName || !formData.address)) {
      setError("Company Name and Address are required for Recruiter");
      return;
    }

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          variant: "success",
        });
        navigate("/auth/login");
      } else {
        setError(data?.payload?.message);
        return;
      }
    });
  }

  // Update form controls based on role selection
  const dynamicFormControls = [...registerFormControls];

  if (formData.role === "Recruiter") {
    dynamicFormControls.push(
      {
        name: "companyName",
        label: "Company Name",
        placeholder: "Enter your company name",
        componentType: "input",
        type: "text",
      },
      {
        name: "address",
        label: "Address",
        placeholder: "Enter your company address",
        componentType: "input",
        type: "text",
      }
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      </div>

      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="text-sm">&nbsp;</div> // Khoảng trống khi không có lỗi
      )}

      <CommonForm
        formControls={dynamicFormControls}
        buttonText={"Sign up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
