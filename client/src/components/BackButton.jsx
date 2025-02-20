import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 mt-14 text-gray-700 hover:text-gray-900"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  );
};
export default BackButton