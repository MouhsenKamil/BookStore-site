import { Link } from "react-router-dom"


export default function ForgotPassword(props: { parent: 'user' | 'seller' }) {
  const { parent: parentEndpoint } = props
  return (
    <>
      <form action="">
        Forgot Password?
        <label>
          Enter your Email: 
          <input type="email" id="email-input" />
        </label>
      </form>
      <Link to={`/accounts/${parentEndpoint}/login`}>No, I remember</Link>
    </>
  )
}
