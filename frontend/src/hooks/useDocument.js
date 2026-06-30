import React from 'react'
import { useState } from 'react';
import api from '../api/axios';

export default function useDocument(id) {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = async () => {
        try {
          const response = await api.get(`/documents/?workspace_id=${id}`);
          setDocuments(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("file_type", "pdf");
    formData.append("workspace_id", id);
    setUploading(true);
    try {
      await api.post("/documents/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return {
    documents,
    uploading,
    fetchDocuments,
    handleUpload
  }
}
