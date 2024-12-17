export const registerFormControls = [
  {
    name: "name",
    label: "Tên",
    placeholder: "Nhập tên",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    componentType: "input",
    type: "password",
  },
  {
    name: "role",
    label: "Vai trò",
    componentType: "select",
    options: ["Candidate", "Recruiter"],
  },
];

export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Nhập email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Nhập mật khẩu",
      componentType: "input",
      type: "password",
    },
  ];