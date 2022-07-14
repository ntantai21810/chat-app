import * as React from "react";
import styles from "../../assets/styles/RegisterForm.module.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../common/Input";
import Button from "../common/Button";
import LoadingIcon from "../common/LoadingIcon";
import { BiError } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

export interface IRegisterFormProps {
  onSubmit: (data: IRegisterFormData) => any;
  errorMessage?: string;
  isLogging?: boolean;
}

export interface IRegisterFormData {
  phone: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  avatar: any;
}

const schema = yup
  .object({
    phone: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    fullName: yup.string().required("Vui lòng nhập họ tên"),
    password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không trùng khớp")
      .required("Vui lòng nhập lại mật khẩu"),
    avatar: yup.mixed().test("required", "Vui lòng chọn avatar", (file) => {
      return file && file.length;
    }),
  })
  .required();

export default function RegisterForm(props: IRegisterFormProps) {
  const { onSubmit, errorMessage, isLogging } = props;
  const [avatar, setAvatar] = React.useState("");

  const handleOnSubmit = (values: IRegisterFormData) => {
    if (onSubmit) onSubmit(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>({
    defaultValues: {
      phone: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
    resolver: yupResolver(schema),
  });

  return (
    <form
      className={styles.form}
      autoComplete="off"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <div className={styles.inputImage}>
        {!avatar && (
          <div className={styles.inputIcon}>
            <AiOutlinePlus fontSize={"2rem"} />
            <span>Thêm ảnh</span>
          </div>
        )}

        {avatar && (
          <div className={styles.avatar}>
            <img src={avatar} alt="Register form avatar" />
          </div>
        )}

        <input
          className={styles.input}
          type="file"
          {...register("avatar")}
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];

              const reader = new FileReader();

              reader.readAsDataURL(file);

              reader.onload = function () {
                if (reader.result) setAvatar(reader.result as string);
              };

              reader.onerror = function (error) {
                console.log("Error: ", error);
              };

              register("avatar").onChange(e);
            }
          }}
        />
      </div>

      {!!errors.avatar && !avatar && (
        <span className={styles.error}>
          <div className={styles.icon}>
            <BiError />
          </div>

          {errors.avatar.message}
        </span>
      )}

      <Input
        {...register("phone")}
        error={!!errors.phone}
        placeholder="Nhập số điện thoại"
        helperText={errors.phone?.message}
      />
      <Input
        {...register("fullName")}
        error={!!errors.fullName}
        placeholder="Nhập họ và tên"
        helperText={errors.fullName?.message}
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
        <span className={styles.errorMessage}>
          {errorMessage && (
            <div className={styles.icon}>
              <BiError />
            </div>
          )}
          {errorMessage}
        </span>
      )}

      <Button
        type="submit"
        disabled={isLogging}
        icon={isLogging ? <LoadingIcon /> : null}
      >
        Đăng ký
      </Button>
    </form>
  );
}
