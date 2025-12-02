import React from 'react'
import './App.css'
import Home from './Home'
const App = () => {
  return (

<div
  className="flex justify-center items-center h-screen w-full"
  style={{
    backgroundImage: `url("https://res.cloudinary.com/dehdhj8d0/image/upload/v1764684320/bg_ejs1tf.jpg")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat:'no-repeat'
  }}
>
<Home/>
</div>
  )
}

export default App