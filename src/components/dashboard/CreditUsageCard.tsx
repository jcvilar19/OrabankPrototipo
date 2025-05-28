import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const CreditUsageCard = () => {
  const totalCredit = 120000;
  const usedCredit = 36000;
  const percentUsed = Math.round(usedCredit / totalCredit * 100);
  
  const getUsageLevel = (percent: number) => {
    if (percent <= 30) return {
      text: "Óptimo",
      color: "bg-finance-green"
    };
    if (percent <= 50) return {
      text: "Bueno",
      color: "bg-finance-blue"
    };
    if (percent <= 75) return {
      text: "Precaución",
      color: "bg-finance-yellow"
    };
    return {
      text: "Alto",
      color: "bg-finance-red"
    };
  };
  
  const usageLevel = getUsageLevel(percentUsed);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Card className="card-shadow card-hover bg-white">
      <CardHeader className="px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Uso de Crédito</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-finance-gray" />
              </TooltipTrigger>
              <TooltipContent className="w-[300px]">
                <ScrollArea className="h-[250px]">
                  <p className="text-sm">Esta barra indica el porcentaje de tu crédito total disponible que ya utilizaste. Mantener este porcentaje por debajo del 30% es ideal para mantener o mejorar tu score crediticio y salud financiera general.</p>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-finance-gray-dark">Disponible</div>
            <div className="text-sm font-medium">{formatCurrency(totalCredit - usedCredit)}</div>
          </div>
          <Progress value={percentUsed} className={`h-3 ${usageLevel.color}`} />
          <div className="flex justify-between items-center mt-1">
            <div className="text-sm text-finance-gray-dark">Utilizado</div>
            <div className="text-sm font-medium">{formatCurrency(usedCredit)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-3xl font-bold">{percentUsed}%</div>
            <div className="text-sm text-finance-gray-dark">de {formatCurrency(totalCredit)}</div>
          </div>
          
          <div className={`px-3 py-1 rounded-full ${usageLevel.color.replace('bg-', 'bg-')}`}>
            <span className={`text-sm font-medium ${usageLevel.color === 'bg-finance-yellow' || usageLevel.color === 'bg-finance-green' ? 'text-finance-gray-dark' : 'text-white'}`}>
              {usageLevel.text}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditUsageCard;
