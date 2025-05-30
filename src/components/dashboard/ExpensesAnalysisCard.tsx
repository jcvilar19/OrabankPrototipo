import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

const ExpensesAnalysisCard = () => {
  const expenses = [
    {
      name: 'Vivienda',
      value: 8500,
      color: '#3A86FF'
    }, 
    {
      name: 'Transporte',
      value: 2200,
      color: '#9B59B6'
    }, 
    {
      name: 'Alimentación',
      value: 4800,
      color: '#4CAF50'
    }, 
    {
      name: 'Entretenimiento',
      value: 1800,
      color: '#FFC107'
    }, 
    {
      name: 'Otros',
      value: 1500,
      color: '#8E9196'
    }
  ];
  
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.value, 0);
  
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
          <CardTitle className="text-lg font-medium">Análisis de Gastos</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-finance-gray" />
              </TooltipTrigger>
              <TooltipContent className="w-[300px] bg-white">
                <ScrollArea className="h-[250px]">
                  <p className="text-sm">Desglose de tus gastos mensuales por categoría.</p>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={expenses} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  outerRadius={80} 
                  innerRadius={40} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
            {expenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{
                      backgroundColor: expense.color
                    }} 
                  />
                  <span className="text-sm">{expense.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{formatCurrency(expense.value)}</span>
                  <span className="text-xs text-finance-gray-dark">
                    {Math.round(expense.value / totalExpenses * 100)}%
                  </span>
                </div>
              </div>
            ))}
            
            <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link to="/dashboard" className="text-finance-blue flex items-center justify-center font-medium">
            Ver análisis detallado
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesAnalysisCard;
