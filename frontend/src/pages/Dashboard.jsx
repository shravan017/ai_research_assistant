import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import api from "../api/axios"
import { useAuth } from '../context/AuthContext'


const Dashboard = () => {

  const {logout} = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [workspaces, setWorkspaces] = useState([])

  useEffect(() => {
    fetchWorkspaces();
  },[])

  const handleLogout = () => {
    logout();
    navigate("/")
  }

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get("/workspaces/")
      setWorkspaces(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const createWorkspace = async () => {
    try {
      const response = await api.post("/workspaces/", {name})
      setName("")
      fetchWorkspaces();
    } catch(error){ console.error(error); }
  }

  return (
    <div className='min-h-screen bg-black p-8 text-white'>
        <div className='skicky flex justify-between items-center mb-8"'>
          <h1 className='text-3xl font-bold text-white'>AI RESEARCH WORKSPACE</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <div className='flex gap-2 mb-8 mt-8'>
          <input type='text' placeholder='Workspace name' value={name} 
            onChange={(e) => setName(e.target.value)}
            className='text-black bg-white rounded p-2'
          />
          <button onClick={createWorkspace} className='bg-green-900 px-4 py-2 rounded'> + CREATE </button>
        </div>
        <div className='grid gap-4'>
          {workspaces.map((workspace) => (
            <div key={workspace.id} className='bg-zinc-700 p-4 rounded'>
              <h2 className='text-xl'>{workspace.name}</h2>
              <button onClick={()=> navigate(`/workspace/${workspace.id}`)}
                className='mt-2 bg-green-500 px-3 py-1 rounded'
              > Open </button>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Dashboard