import './ContactUs.css'

export default function ContactUs() {
  return (
    <form className='contact-us-form' action="" method="POST">
      <div className='form-heading'>Contact us</div>
      <input type="text" id="name" placeholder="Enter your name" required />
      <input type="email" id="email" placeholder="Enter your email" required />
      <textarea id="message" placeholder="Write your message here..." required />
      <button type="submit">Send Message</button>
    </form>
  )
}
