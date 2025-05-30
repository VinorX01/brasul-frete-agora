import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import MobilePageWrapper from "@/components/MobilePageWrapper";
const BecomeAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const generateAgentCode = async () => {
    try {
      // Get the highest existing code
      const {
        data: agents,
        error: countError
      } = await supabase.from("agents").select("code").order("code", {
        ascending: false
      }).limit(1);
      if (countError) {
        throw new Error("Error fetching agent codes");
      }
      let newCode: string;

      // Generate a new code by incrementing the highest existing code or start at 10000
      if (agents && agents.length > 0 && !isNaN(Number(agents[0].code))) {
        const highestCode = Number(agents[0].code);
        newCode = String(highestCode + 1).padStart(5, '0');
      } else {
        newCode = "10000"; // Start with this if no codes exist
      }
      return newCode;
    } catch (error) {
      console.error("Error generating agent code:", error);
      throw error;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e telefone.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Generate a new agent code
      const newCode = await generateAgentCode();

      // Insert new agent data into the database
      const {
        error
      } = await supabase.from("agents").insert({
        code: newCode,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        active: true
      });
      if (error) {
        throw error;
      }

      // Store the generated code and show the success dialog
      setGeneratedCode(newCode);
      setShowCodeDialog(true);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: ""
      });
    } catch (error) {
      console.error("Error creating agent:", error);
      setErrorMessage("Ocorreu um erro ao gerar seu código. Por favor tente novamente.");
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <MobilePageWrapper>
      <div className="bg-[#f4f4fc] min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="font-bold mb-2 text-xl text-left">Torne-se um Agenciador</h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-left">
                Seja um agenciador de fretes da Brasul Transportes e ganhe comissões por cada frete intermediado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-primary">
                  Solicitar Código de Agenciador
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input id="name" placeholder="Seu nome completo" value={formData.name} onChange={e => handleChange("name", e.target.value)} required />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input id="phone" placeholder="(99) 99999-9999" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} required />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail (opcional)</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                      {isSubmitting ? "Gerando código..." : "Solicitar Código"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      * Campos obrigatórios
                    </p>
                  </div>
                </form>
              </div>

              <div className="bg-accent rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-primary">
                  Como funciona o programa de agenciadores?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Solicite seu código</h3>
                      <p className="text-gray-600 text-sm">
                        Preencha o formulário e receba seu código único de agenciador.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Compartilhe fretes</h3>
                      <p className="text-gray-600 text-sm">
                        Use seu código para gerar links personalizados para os fretes disponíveis em nossa plataforma.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Ganhe comissões</h3>
                      <p className="text-gray-600 text-sm">
                        Receba uma comissão por cada frete que for finalizado por meio do seu link.
                      </p>
                    </div>
                  </div>
                  
                  
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-primary-light">
                  <p className="text-sm text-center font-medium text-primary">A comissão média dos agenciadores varia de R$ 50,00 até 10% do valor do frete, dependendo do tipo, número de intermediários e distância da carga.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-center">Perguntas Frequentes</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Como recebo minhas comissões?</h3>
                  <p className="text-gray-600 text-sm">As comissões de cada frete são pagas na mesma hora via PIX ou transferência bancária, após o caminhoneiro confirmar o agendamento da carga.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Posso agenciar quantos fretes?</h3>
                  <p className="text-gray-600 text-sm">
                    Sim, não há limite para a quantidade de fretes que você pode agenciar.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Preciso ter experiência?</h3>
                  <p className="text-gray-600 text-sm">
                    Não é necessário ter experiência prévia, mas conhecimento no setor de transportes é um diferencial.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary mb-2">Quanto tempo leva para receber meu código?</h3>
                  <p className="text-gray-600 text-sm">Sem demora, seu código fica pronto no mesmo instante após a solicitação.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog - Show when code is generated */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Novo código gerado com sucesso!</DialogTitle>
            <DialogDescription className="text-center">
              <p className="mt-4 mb-6">Seu código é:</p>
              <div className="text-3xl font-bold text-primary mb-6">{generatedCode}</div>
              <p>O código já está pronto para ser utilizado.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowCodeDialog(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erro</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowErrorDialog(false)}>Fechar</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </MobilePageWrapper>;
};
export default BecomeAgent;