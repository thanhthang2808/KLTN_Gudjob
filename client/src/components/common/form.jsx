import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  const [acceptTerms, setAcceptTerms] = useState(true);
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem} value={optionItem}>
                      {optionItem} {/* Hiển thị giá trị option */}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }

  useEffect(() => {
    if (buttonText === "Đăng ký") {
      setAcceptTerms(false);
    }
  }, [buttonText]);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      {buttonText === "Đăng nhập" && (
        <div className="text-right mb-1 mt-1">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Quên mật khẩu
          </a>
        </div>
      )}

      {buttonText === "Đăng ký" && (
        <div className="mt-4">
          <div className="text-right mb-1 mt-1">
            {/* Additional sign-up specific fields can go here */}
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Tôi đồng ý với{" "}
                <a href="/terms-and-conditions" className="text-blue-500 hover:underline">
                  chính sách điều khoản và điều kiện
                </a> của Gudjob.
              </span>
            </label>
          </div>
        </div>
      )}
      <Button
        disabled={!acceptTerms}
        type="submit"
        className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
