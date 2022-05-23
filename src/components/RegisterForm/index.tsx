import * as React from "react";
import styles from "./style.module.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../common/Input";
import Button from "../common/Button";

export interface IRegisterFormProps {
  onSubmit: (data: IRegisterFormData) => any;
}

export interface IRegisterFormData {
  phone: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    phone: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không trùng khớp")
      .required("Vui lòng nhập lại mật khẩu"),
  })
  .required();

export default function RegisterForm(props: IRegisterFormProps) {
  const { onSubmit } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>({
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  return (
    <form
      className={styles.form}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Số điện thoại"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      <Input
        label="Mật khẩu"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Input
        label="Nhập lại mật khẩu"
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button type="submit">Đăng ký</Button>
    </form>
  );
}
