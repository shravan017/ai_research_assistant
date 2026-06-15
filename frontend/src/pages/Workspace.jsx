import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios';
import ReactMarkdown from "react-markdown";


function Workspace() {

  const messagesEndRef = useRef(null)
  const {id} = useParams();
  const [documents, setDocuments] = useState([])
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);


  useEffect(() => {
    fetchDocuments();
    fetchConversations();
  },[id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  useEffect(() => {
    loadHistory();
  }, [id]);




  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/documents/?workspace_id=${id}`)
      console.log(response.data)
      setDocuments(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await api.get(
        `/ai/conversations/${id}/`
      );
      setConversations(response.data);
    } catch(error) {
      console.error(error);
    }
  };
  
  const createConversation = async () => {
    try {
      const response = await api.post(
        "/ai/conversations/create/",
        {
          workspace_id: id
        }
      );
      fetchConversations();
    } catch(error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    console.log("upload started")
    const file = e.target.files[0];
    console.log(file)
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file)
    formData.append("title", file.name)
    formData.append("file_type", "pdf")
    formData.append("workspace_id", id)

    try {
      console.log(formData)
      await api.post("/documents/upload/", 
        formData,
         {
           headers: {
            "Content-Type" : "multipart/form-data"
         }
        }
      );
      fetchDocuments()
    } catch(error) {
      console.error(error)
      console.log(error.response)
    }
  }

  const loadHistory = async () => {

    try {

      const response = await api.get(
        `/ai/history/${id}/`
      );

      const history = response.data.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
        sources: []
      }));

      setMessages(history);

    } catch(error) {

      console.error(error);

    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role:"user",
      content: question,
      timestamp: new Date()
    };
    setMessages (prev => [
      ...prev,
      userMessage
    ]);
    setLoading(true)
    try {
      const response = await api.post("/ai/agent/", {question:question, workspace_id:id});
      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources || [],
        timestamp: new Date()
    };
      setMessages(prev => [
        ...prev,
        aiMessage
      ]);
    } catch(error){
      console.error(error)
    } finally { setLoading(false) }
    setQuestion("");
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
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">
              Chats
            </h3>
            <button
              onClick={createConversation}
              className="text-sm bg-green-600 px-2 py-1 rounded"
            >
              + New Chat
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() =>
                  setSelectedConversation(
                    conversation.id
                  )
                }
                className="
                  p-2
                  bg-zinc-800
                  rounded
                  cursor-pointer
                "
              >
                💬 {conversation.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right side chat area */}
      <div className='flex-1 flex flex-col'>
        <div className='flex-1 p-6 overflow-y-auto space-y-6'>
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-bold mb-2">
                AI Research Assistant
              </h2>
              <p className="text-gray-400">
                Upload research papers and ask questions.
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : "bg-zinc-800"
                }`}
              >

                <div className="font-semibold mb-1">
                  {message.role === "user"
                    ? "👤 You"
                    : "🤖 Research Agent"}
                </div>
                <div>
                  <div className='pros pros-invert max-w-none'>
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                    
                  </div>
                  {message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-3 border-t border-zinc-700 pt-3">
                      <div className="font-semibold text-sm mb-2">
                        Sources
                      </div>
                      {message.sources.map((source, index) => (
                        <div
                          key={index}
                          className="
                            bg-zinc-900
                            p-2
                            rounded
                            mb-1
                            text-sm
                          "
                        >
                          📄 {source.document}
                        </div>
                      ))}

                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(
                        message.timestamp
                    ).toLocaleTimeString()}
                  </div>

                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
          {loading && (
            <div className="flex justify-start p-4">
              <div className="bg-zinc-800 rounded-xl p-4">
                🤖 Thinking...
              </div>
            </div>
          )}
        </div>

        <div className='border-t border-zinc-600 p-4'>
          <div className='flex gap-2'>
            <input 
              type='text'
              value={question}
              onChange={(e)=>setQuestion(e.target.value)}
              placeholder='Ask me question...'
              className='flex-1 p-4 rounded text-white mb-4 bg-zinc-700'
            />
            <button
              onClick={sendQuestion}
              disabled={loading}
              className="
                bg-green-600
                px-5
                rounded
                disabled:bg-zinc-700
                w-24
                h-14
              "
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workspace