
import {ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import SettingsList from '../components/SettingsList';

export default function Setting() {
  const navigate = useNavigate();
 
  
  
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-neutral-800 p-4">
       
        
        <div className="flex  ">
          
          <button
            onClick={()=>navigate("/dashboard")}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
             
          >
            <ArrowLeft size={18} />
          </button>
        </div>
        <div
            className="text-white mx-auto"
            
          >
            Settings
          </div>
      </header>
      
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        
    
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <SettingsList />
        </motion.div>
      </main>
      
      
    </div>
  );
}