import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText,
  MapPin,
  Car,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleRecord {
  plate: string;
  status: 'valid' | 'expired' | 'unpaid';
  timeRemaining?: string;
  paidUntil?: string;
  zone: string;
  violationTime?: string;
  violationId?: string;
}

// Mock data
const mockRecords: Record<string, VehicleRecord> = {
  'ABC-1234': {
    plate: 'ABC-1234',
    status: 'valid',
    timeRemaining: '45 min',
    paidUntil: '14:30',
    zone: 'Centro'
  },
  'XYZ-5678': {
    plate: 'XYZ-5678', 
    status: 'expired',
    paidUntil: '12:15',
    zone: 'Centro'
  },
  'DEF-9012': {
    plate: 'DEF-9012',
    status: 'unpaid',
    zone: 'Centro'
  }
};

export function FiscalApp() {
  const [plateSearch, setPlateSearch] = useState('');
  const [searchResult, setSearchResult] = useState<VehicleRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [violations, setViolations] = useState<VehicleRecord[]>([]);

  const formatPlate = (value: string) => {
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (clean.length <= 3) {
      return clean;
    } else if (clean.length <= 7) {
      return clean.slice(0, 3) + '-' + clean.slice(3);
    }
    return clean.slice(0, 3) + '-' + clean.slice(3, 7);
  };

  const handleSearch = () => {
    const cleanPlate = plateSearch.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const formattedPlate = cleanPlate.slice(0, 3) + '-' + cleanPlate.slice(3);
    
    const result = mockRecords[formattedPlate] || {
      plate: formattedPlate,
      status: 'unpaid' as const,
      zone: 'Centro'
    };
    
    setSearchResult(result);
  };

  const simulateOcr = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomPlates = Object.keys(mockRecords);
      const randomPlate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
      setPlateSearch(randomPlate);
      setSearchResult(mockRecords[randomPlate]);
      setIsScanning(false);
    }, 2500);
  };

  const generateViolation = (vehicle: VehicleRecord) => {
    const violation = {
      ...vehicle,
      violationTime: new Date().toLocaleTimeString('pt-BR'),
      violationId: `AUT${Date.now().toString().slice(-6)}`
    };
    
    setViolations(prev => [violation, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-accent text-accent-foreground';
      case 'expired': return 'bg-warning text-warning-foreground';
      case 'unpaid': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      case 'unpaid': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return 'Pago e Válido';
      case 'expired': return 'Tempo Expirado';
      case 'unpaid': return 'Não Pago';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-primary">Fiscal Zona Azul</h1>
        </div>
        <p className="text-sm text-muted-foreground">Sistema de Fiscalização</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Consulta</TabsTrigger>
          <TabsTrigger value="violations">Autuações</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="w-5 h-5" />
                Verificar Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant={isScanning ? "default" : "outline"}
                  className={cn(
                    "w-full h-12",
                    isScanning && "animate-pulse-glow"
                  )}
                  onClick={simulateOcr}
                  disabled={isScanning}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isScanning ? 'Lendo placa...' : 'Escanear Placa'}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground">ou</div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="ABC-1234"
                    value={plateSearch}
                    onChange={(e) => setPlateSearch(formatPlate(e.target.value))}
                    className="text-center font-mono"
                    maxLength={8}
                  />
                  <Button onClick={handleSearch} disabled={plateSearch.length < 8}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Result */}
          {searchResult && (
            <Card className="animate-slide-up">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    <span className="font-mono font-bold text-lg">{searchResult.plate}</span>
                  </div>
                  <Badge className={getStatusColor(searchResult.status)}>
                    {getStatusIcon(searchResult.status)}
                    <span className="ml-1">{getStatusText(searchResult.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Zona:</span>
                    <div className="font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {searchResult.zone}
                    </div>
                  </div>
                  
                  {searchResult.status === 'valid' && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Tempo restante:</span>
                        <div className="font-semibold text-accent">{searchResult.timeRemaining}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Válido até:</span>
                        <div className="font-semibold">{searchResult.paidUntil}</div>
                      </div>
                    </>
                  )}
                  
                  {searchResult.status === 'expired' && (
                    <div>
                      <span className="text-muted-foreground">Expirou às:</span>
                      <div className="font-semibold text-warning">{searchResult.paidUntil}</div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Consulta: {new Date().toLocaleString('pt-BR')}
                </div>

                {(searchResult.status === 'expired' || searchResult.status === 'unpaid') && (
                  <Button
                    className="w-full bg-destructive hover:bg-destructive/90"
                    onClick={() => generateViolation(searchResult)}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Gerar Autuação
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Autuações do Dia
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {violations.length} autuação(ões) registrada(s)
              </p>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma autuação registrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {violations.map((violation, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-destructive/5 border-destructive/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold">{violation.plate}</span>
                        <Badge variant="destructive" className="text-xs">
                          #{violation.violationId}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Zona: {violation.zone}</div>
                        <div>Horário: {violation.violationTime}</div>
                        <div>Motivo: {violation.status === 'expired' ? 'Tempo expirado' : 'Estacionamento não pago'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}