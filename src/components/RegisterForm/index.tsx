import * as React from "react";
import styles from "./style.module.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../common/Input";
import Button from "../common/Button";

export interface IRegisterFormProps {
  onSubmit: (data: IRegisterFormData) => any;
  errorMessage?: string;
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
  const { onSubmit, errorMessage } = props;

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
        {...register("phone")}
        error={!!errors.phone}
        placeholder="Nhập số điện thoại"
        helperText={errors.phone?.message}
      />
      <Input
        type="password"
        {...register("password")}
        error={!!errors.password}
        placeholder="Nhập mật khẩu"
        helperText={errors.password?.message}
      />
      <Input
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        placeholder="Nhập lại mật khẩu"
        helperText={errors.confirmPassword?.message}
      />

      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}

      <Button type="submit">Đăng ký</Button>
    </form>
  );
}
