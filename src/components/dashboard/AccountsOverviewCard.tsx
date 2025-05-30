import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const AccountsOverviewCard = () => {
  const accounts = [{
    type: 'Cuenta de Débito',
    name: 'Nómina',
    balance: 17250.75,
    currency: 'MXN',
    trend: 'up'
  }, {
    type: 'Cuenta de Ahorros',
    name: 'Ahorro Vacaciones',
    balance: 35000,
    currency: 'MXN',
    trend: 'up'
  }, {
    type: 'Inversión',
    name: 'CETES',
    balance: 50000,
    currency: 'MXN',
    trend: 'up'
  }, {
    type: 'Tarjeta de Crédito',
    name: 'Platinum',
    balance: -24500,
    currency: 'MXN',
    trend: 'down'
  }];
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  return <Card className="card-shadow card-hover bg-white">
      <CardHeader className="px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Cuentas Activas</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-finance-gray" />
              </TooltipTrigger>
              <TooltipContent className="w-[300px] bg-white">
                <ScrollArea className="h-[250px]">
                  <p className="text-sm">En esta sección puedes revisar el saldo actual y la evolución reciente de tus diferentes cuentas activas con el banco. Esto incluye cuentas de débito, ahorro, inversión, y tarjetas de crédito, permitiéndote controlar mejor tu dinero y planificar tus finanzas.</p>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {accounts.map((account, index) => <div key={index} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-finance-gray-dark">{account.type}</div>
                <div className="font-medium">{account.name}</div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${account.balance < 0 ? 'text-finance-red' : 'text-finance-gray-dark'}`}>
                  {formatCurrency(Math.abs(account.balance), account.currency)}
                </div>
                <div className={`text-xs ${account.trend === 'up' ? 'text-finance-green' : 'text-finance-red'} flex items-center justify-end`}>
                  {account.trend === 'up' ? '+2.4%' : '-1.8%'}
                  <ArrowUpRight className={`h-3 w-3 ml-1 ${account.trend === 'down' ? 'transform rotate-90' : ''}`} />
                </div>
              </div>
            </div>)}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link to="/accounts" className="text-finance-blue flex items-center justify-center font-medium">
            Ver todas las cuentas
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>;
};

export default AccountsOverviewCard;
