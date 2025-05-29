
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate("../../index.html")}
      className="mb-4 text-primary"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
};

export default BackButton;
