import * as React from "react";
import styles from "./style.module.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../common/Input";
import Button from "../common/Button";

export interface ILoginFormProps {
  onSubmit: (data: ILoginFormData) => any;
}

export interface ILoginFormData {
  phone: string;
  password: string;
}

const schema = yup
  .object({
    phone: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
  })
  .required();

export default function LoginForm(props: ILoginFormProps) {
  const { onSubmit } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormData>({
    defaultValues: {
      phone: "",
      password: "",
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
        error={errors.phone?.message}
      />
      <Input
        label="Mật khẩu"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <p className={styles.forgotPassword}>Quên mật khẩu?</p>

      <Button type="submit">Đăng nhập</Button>
    </form>
  );
}
