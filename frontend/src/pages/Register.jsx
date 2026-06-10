import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:"",
        password:"",
        confirm_password:"",
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await api.post("/auth/register/", formData)
            alert(" Registration is Successfull!!")
            navigate("/login");
        } catch (err) {
            console.log(err.response?.data);
            alert("Registration Failed !!!")
        }
    }
  return (
    <>
        <div className='min-h-screen flex items-center justify-center bg-black'>
            <form onSubmit={handleSubmit} className='bg-zinc-800 p-8 w-92 rounded-lg'>
                <h1 className='text-2xl text-white font-bold mb-6 text-center'>Register</h1>

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
                <input 
                    type="password"
                    name='confirm_password'
                    placeholder='Enter your password Again'
                    className='w-full p-2 mb-8 rounded bg-white'
                    onChange={handleChange}
                />
                <button className='w-full bg-blue-500 rounded p-2 text-white'>
                    Register
                </button>
                <p className='mt-4 text-white'>
                    Already have an account ?
                    <Link to="/login" className='text-blue-500 ml-2 underline'>Login</Link>
                </p>
            </form>
        </div>
    </>
  )
}

export default Register