// import axios, { AxiosError } from "axios"
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { Link } from "react-router-dom"


// interface ForgotPasswordFormProps {
//   email: string
//   oldPassword: string
//   newPassword: string
// }


// export default function ForgotPassword(props: { parent: 'user' | 'seller' }) {
//   const [forgotPasswordErr, setForgotPasswordErr] = useState('')
//   const { parent: parentEndpoint } = props
  
//   const { register, handleSubmit, formState: { errors }} = useForm<ForgotPasswordFormProps>()

//   const onSubmit = async (data: ForgotPasswordFormProps) => {
//     try {
//       const response = await axios.post('/api/auth/change-password', data)

//       if (response.status !== 204)
//         throw new Error("Failed to send reset request")

//       alert("Password reset instructions have been sent to the server. It'll take in effect shortly.")
//     } catch (err) {
//       console.error(err);
//       setForgotPasswordErr((err as AxiosError).message)
//     }
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="form-heading">Change your Password</div>
//         <input
//             type="email"
//             {...register("email", { required: "Email is required" })}
//             placeholder="Enter your Email"
//           />
//         {errors.email && <p className='error-msg'>{errors.email.message}</p>}

//         <input
//           type="password" className="password-input" placeholder="Old Password"
//           {...register("oldPassword", { required: "old password is required" })}
//         />
//         {errors.oldPassword && <p className='error-msg'>{errors.oldPassword.message}</p>}

//         <input
//           type="password" className="password-input" placeholder="New Password"
//           {...register("newPassword", { required: "new password is required" })}
//         />
//         {errors.newPassword && <p className='error-msg'>{errors.newPassword.message}</p>}

//         {forgotPasswordErr && <p className="forgot-password-err error-msg">{forgotPasswordErr}</p>}
//       </form>
//       <Link to={`/accounts/${parentEndpoint}/login`}>No, I remember</Link>
//     </>
//   )
// }
