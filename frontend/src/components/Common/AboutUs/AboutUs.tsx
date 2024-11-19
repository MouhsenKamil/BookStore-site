import { Link } from 'react-router-dom'
import './AboutUs.css'


export default function AboutUs() {
  return (
    <>
      <div className='about-us'>
        <h1>Welcome to the Bookstore site!</h1>
        <p>
          Here, we believe every book tells a story, and every reader has their own journey.
          We're here to help you discover yours! From timeless classics to the latest bestsellers,
          our carefully curated collection is designed to inspire, entertain, and ignite your imagination.
        </p>
        <p>
          <br />
          <ul>
            <li><b>Wide Selection:</b> Fiction, Non-Fiction, Children's books, and more!</li>
            <li><b>Personalized Recommendations:</b> We help you find your next great read.</li>
            <li><b>Passionate Team:</b> Book lovers who understand your love for reading.</li>
            <li><b>Community Focus:</b>Supporting local authors and hosting events to connect bookworms.</li>
          </ul>
        </p>
        <p>
          Stop by or shop online and let's find your next favorite book together!
          <Link to='/'>Go to HomePage</Link>
        </p>
      </div>
    </>
  )
}