import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, CreditCard, QrCode, Clock, Car, MapPin, Printer, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import QRCodeLib from 'qrcode';

interface TotemInterfaceProps {
  className?: string;
}

export function TotemInterface({ className }: TotemInterfaceProps) {
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [paymentStep, setPaymentStep] = useState<'plate' | 'time' | 'payment' | 'success'>('plate');
  const [isOcrMode, setIsOcrMode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [ticketId, setTicketId] = useState('');

  const timeOptions = [
    { hours: 1, price: 2.50 },
    { hours: 2, price: 4.50 },
    { hours: 3, price: 6.00 },
    { hours: 4, price: 7.50 },
  ];

  const formatPlate = (value: string) => {
    // Remove caracteres não alfanuméricos
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Aplica máscara ABC1234 ou ABC1D23
    if (clean.length <= 3) {
      return clean;
    } else if (clean.length <= 7) {
      return clean.slice(0, 3) + '-' + clean.slice(3);
    }
    return clean.slice(0, 3) + '-' + clean.slice(3, 7);
  };

  const handlePlateChange = (value: string) => {
    const formatted = formatPlate(value);
    setPlateNumber(formatted);
  };

  const validatePlate = (plate: string) => {
    const clean = plate.replace(/[^A-Za-z0-9]/g, '');
    return clean.length === 7;
  };

  const simulateOcr = () => {
    setIsOcrMode(true);
    setTimeout(() => {
      setPlateNumber('ABC-1234');
      setIsOcrMode(false);
    }, 3000);
  };

  const calculateTotal = () => {
    const selected = timeOptions.find(opt => opt.hours === selectedTime);
    return selected ? selected.price : 0;
  };

  const generateTicketData = async () => {
    const currentTime = new Date();
    const validUntil = new Date(currentTime.getTime() + (selectedTime || 0) * 60 * 60 * 1000);
    const newTicketId = `ZA${currentTime.getTime().toString().slice(-8)}`;
    
    const ticketData = {
      id: newTicketId,
      plate: plateNumber,
      zone: 'Centro',
      startTime: currentTime.toLocaleString('pt-BR'),
      validUntil: validUntil.toLocaleString('pt-BR'),
      duration: selectedTime,
      amount: calculateTotal(),
      paymentMethod: 'Cartão/PIX'
    };

    // Gera QR Code com os dados do ticket
    const qrData = JSON.stringify(ticketData);
    try {
      const qrCodeDataUrl = await QRCodeLib.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1e40af', // cor azul do tema
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
    
    setTicketId(newTicketId);
  };

  const handlePaymentSuccess = async () => {
    await generateTicketData();
    setPaymentStep('success');
    setTimeout(() => {
      // Reset after 10 seconds to allow time to print/save
      setPaymentStep('plate');
      setPlateNumber('');
      setSelectedTime(null);
      setQrCodeUrl('');
      setTicketId('');
    }, 10000);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('ticket-content');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React app
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `zona-azul-${ticketId}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  return (
    <div className={cn("max-w-md mx-auto bg-gradient-primary p-8 rounded-3xl shadow-totem", className)}>
      <div className="bg-white rounded-2xl p-6 shadow-card-blue">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Zona Azul</h1>
          </div>
          <p className="text-sm text-muted-foreground">Sistema Inteligente de Estacionamento</p>
        </div>

        {/* Step 1: Plate Input */}
        {paymentStep === 'plate' && (
          <Card className="border-primary/20 animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-primary">
                <Car className="w-5 h-5" />
                Informe a Placa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant={isOcrMode ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 text-sm font-medium transition-all",
                    isOcrMode && "animate-pulse-glow"
                  )}
                  onClick={simulateOcr}
                  disabled={isOcrMode}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isOcrMode ? 'Lendo placa...' : 'Capturar com Câmera'}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground">ou</div>
                
                <Input
                  placeholder="ABC-1234"
                  value={plateNumber}
                  onChange={(e) => handlePlateChange(e.target.value)}
                  className="text-center text-lg font-mono tracking-wider h-12"
                  maxLength={8}
                />
              </div>
              
              <Button
                className="w-full h-12 shadow-button-blue"
                onClick={() => setPaymentStep('time')}
                disabled={!validatePlate(plateNumber)}
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Time Selection */}
        {paymentStep === 'time' && (
          <Card className="border-primary/20 animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                Selecione o Tempo
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Placa: <span className="font-mono font-bold">{plateNumber}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((option) => (
                  <Button
                    key={option.hours}
                    variant={selectedTime === option.hours ? "default" : "outline"}
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setSelectedTime(option.hours)}
                  >
                    <span className="text-lg font-bold">{option.hours}h</span>
                    <span className="text-sm">R$ {option.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
              
              {selectedTime && (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">Total a pagar</div>
                  <div className="text-2xl font-bold text-primary">
                    R$ {calculateTotal().toFixed(2)}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentStep('plate')}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1 shadow-button-blue"
                  onClick={() => setPaymentStep('payment')}
                  disabled={!selectedTime}
                >
                  Pagar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {paymentStep === 'payment' && (
          <Card className="border-primary/20 animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-primary">
                <CreditCard className="w-5 h-5" />
                Forma de Pagamento
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {selectedTime}h • R$ {calculateTotal().toFixed(2)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start text-left"
                  onClick={handlePaymentSuccess}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">Cartão</div>
                    <div className="text-xs text-muted-foreground">Débito ou Crédito</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start text-left"
                  onClick={handlePaymentSuccess}
                >
                  <QrCode className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">PIX</div>
                    <div className="text-xs text-muted-foreground">Pagamento instantâneo</div>
                  </div>
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPaymentStep('time')}
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success with Ticket */}
        {paymentStep === 'success' && (
          <div className="space-y-4">
            {/* Success Message */}
            <Card className="border-accent/20 animate-slide-up">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                  <Car className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-accent mb-2">Pagamento Aprovado!</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprovante gerado com sucesso
                  </p>
                  <div className="font-mono font-bold text-lg mt-1">{plateNumber}</div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Ticket */}
            <Card className="border-primary/20" id="ticket-content">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">ZONA AZUL - COMPROVANTE</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  #{ticketId}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center">
                  {qrCodeUrl && (
                    <div className="bg-white p-3 rounded-lg border-2 border-primary/20 shadow-sm">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code do Ticket" 
                        className="w-32 h-32"
                      />
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Escaneie para verificar
                      </p>
                    </div>
                  )}
                </div>

                {/* Ticket Details */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Placa:</span>
                      <div className="font-mono font-bold text-lg">{plateNumber}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Zona:</span>
                      <div className="font-semibold">Centro</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <div className="font-semibold">
                        {new Date().toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Válido até:</span>
                      <div className="font-semibold text-primary">
                        {new Date(Date.now() + (selectedTime || 0) * 60 * 60 * 1000).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duração:</span>
                      <div className="font-semibold">{selectedTime} hora(s)</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <div className="font-bold text-accent">R$ {calculateTotal().toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Data: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>MANTENHA ESTE COMPROVANTE VISÍVEL NO PAINEL</strong>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 text-sm"
                    onClick={handlePrint}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-sm"
                    onClick={handleDownloadQR}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar QR
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    💡 Use o QR Code para validação rápida pelos fiscais
                  </p>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    <MapPin className="w-3 h-3 mr-1" />
                    Zona Azul Centro
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}