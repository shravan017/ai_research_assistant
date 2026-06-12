import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios';


function Workspace() {

  const {id} = useParams();
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    fetchDocuments()
  },[id])

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/documents/?workspace_id=${id}`)
      setDocuments(response.data);
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleUpload = async (e) => {
    const file = e.target.file[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file)
    formData.append("title", file.name)
    formData.append("file_type", "pdf")
    formData.append("workspace_id", id)

    try {
      await api.post("/documents/upload/", formData,
         {
           headers: {
          "Content-Type" : "multipart/form-data",
         },
        }
      );
      fetchDocuments()
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <div className='h-screen bg-black text-white flex'>
      {/* left sidebar */}
      <div className='w-1/4 border-r border-zinc-700 p-4'>
        <h2 className='text-xl font-bold mb-4'> DOCUMENTS </h2>
        
        <input
          type='file'
          onChange={handleUpload}
          className='mb-4 bg-zinc-500 rounded p-2'
        />
        <div className='space-y-2'>
          {documents.map((doc) => (
            <div key={doc.id} className='bg-zinc-600 p-2 rounded'>{doc.title}</div>
          ))}
        </div>
      </div>
      {/* Right side chat area */}
      <div className='flex-1 flex flex-col'>
        <div className='flex-1 p-6 overflow-y-auto'>
          <h1 className='text-3xl font-bold mb-4'>AI Research Assistant</h1>
        </div>
        <div className='border-t border-zinc-600 p-4'>
          <div className='flex gap-2'>
            <input 
              type='text'
              placeholder='Ask me question...'
              className='flex-1 p-4 rounded text-white mb-4 bg-zinc-700'
            />
            <button className='bg-green-600 px-6 w-20 h-13.5 rounded text-xl'>Ask</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workspace