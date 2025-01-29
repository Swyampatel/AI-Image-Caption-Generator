import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/caption", formData);
      setCaption(res.data.caption);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate caption");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600">📸 AI Image Caption Generator</h1>
        <p className="text-center text-gray-600 mt-2">Upload an image, and AI will generate a caption!</p>
        
        <div className="mt-4">
          <input 
            type="file" 
            onChange={handleUpload} 
            className="block w-full p-2 border rounded-lg cursor-pointer bg-gray-50" 
            accept="image/*"
          />
        </div>

        {image && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="mt-4"
          >
            <img src={image} alt="Preview" className="rounded-lg shadow-md w-full" />
          </motion.div>
        )}

        {loading && (
          <p className="text-center text-blue-600 mt-4 animate-pulse">🔄 Generating caption...</p>
        )}

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="text-red-500 text-center mt-4"
          >
            ❌ {error}
          </motion.p>
        )}

        {caption && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }} 
            className="mt-4 p-4 bg-blue-50 rounded-lg shadow-md"
          >
            <p className="text-lg font-semibold">📝 Generated Caption:</p>
            <p className="mt-2 text-gray-800">{caption}</p>
          </motion.div>
        )}

        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
        >
          🔄 Upload Another Image
        </button>
      </motion.div>
    </div>
  );
}

export default App;
