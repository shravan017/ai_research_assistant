import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Login = () => {

  const navigate = useNavigate()
  const {login} = useAuth()

  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await api.post("/token/", formData);
      login( response.data.access, response.data.refresh);
      navigate("/dashboard")


    } catch (err){
      console.log(err.response?.data);
      alert("Invalid credentials. Enter again !")
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
        <form onSubmit={handleSubmit} className='bg-zinc-800 p-8 w-92 rounded-lg'>
            <h1 className='text-2xl text-white font-bold mb-6 text-center'>Login To Application</h1>

            <input 
                type="email"
                name='email'
                placeholder='Enter your Email'
                className='w-full p-2 mb-6 rounded bg-white'
                onChange={handleChange}
            />
            <input 
                type="password"
                name='password'
                placeholder='Enter your password'
                className='w-full p-2 mb-6 rounded bg-white'
                onChange={handleChange}
            />
            
            <button className='w-full bg-blue-500 rounded p-2 text-white'>
                Login
            </button>
            <p className='mt-4 text-white'>
                Don't have an account ?
                <Link to="/register" className='text-blue-500 ml-2 underline'>Register</Link>
            </p>
        </form>

    </div>
  )
}

export default Login