import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TotemInterface } from '@/components/TotemInterface';
import { FiscalApp } from '@/components/FiscalApp';
import { AdminDashboard } from '@/components/AdminDashboard';
import { 
  Monitor, 
  Smartphone, 
  BarChart3, 
  Car,
  Shield,
  MapPin,
  CheckCircle
} from 'lucide-react';

type ViewMode = 'home' | 'totem' | 'fiscal' | 'admin';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  if (currentView === 'totem') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('home')}
            className="bg-white/80"
          >
            ← Voltar
          </Button>
          <Badge className="bg-primary text-white">Modo Totem</Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <TotemInterface />
        </div>
      </div>
    );
  }

  if (currentView === 'fiscal') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('home')}
          >
            ← Voltar
          </Button>
          <Badge className="bg-primary text-white">App Fiscal</Badge>
        </div>
        <FiscalApp />
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 border-b bg-white">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('home')}
          >
            ← Voltar
          </Button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold">Zona Azul Inteligente</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Sistema completo de gerenciamento de estacionamento rotativo com tecnologia OCR, 
            pagamentos digitais e fiscalização automatizada
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">OCR Automático</h3>
              <p className="text-blue-100 text-sm">
                Leitura automática de placas com alta precisão em qualquer ângulo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pagamento Seguro</h3>
              <p className="text-blue-100 text-sm">
                Múltiplas formas de pagamento: cartão, PIX e QR Code
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gestão Inteligente</h3>
              <p className="text-blue-100 text-sm">
                Monitoramento em tempo real e analytics preditivos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Modules */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Demonstração dos Módulos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Totem Module */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentView('totem')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Totem de Autoatendimento</h3>
                <p className="text-muted-foreground mb-4">
                  Interface touchscreen para pagamento com OCR e múltiplas formas de pagamento
                </p>
                <Button className="w-full shadow-button-blue">
                  Testar Totem
                </Button>
              </CardContent>
            </Card>

            {/* Fiscal Module */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentView('fiscal')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-warning rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">App de Fiscalização</h3>
                <p className="text-muted-foreground mb-4">
                  Aplicativo mobile para agentes com consulta em tempo real e geração de autuações
                </p>
                <Button className="w-full shadow-button-blue">
                  Abrir App Fiscal
                </Button>
              </CardContent>
            </Card>

            {/* Admin Module */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentView('admin')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Dashboard Administrativo</h3>
                <p className="text-muted-foreground mb-4">
                  Painel completo com métricas, relatórios e gestão de zonas
                </p>
                <Button className="w-full shadow-button-blue">
                  Ver Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Note */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                💡 Pronto para Integração MySQL
              </h3>
              <p className="text-blue-100 text-sm">
                Este protótipo demonstra todas as funcionalidades do sistema. 
                Para conectar ao seu banco MySQL, basta implementar as APIs REST 
                correspondentes aos endpoints mockados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
