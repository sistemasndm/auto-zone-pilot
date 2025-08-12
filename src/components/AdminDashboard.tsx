import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Car,
  AlertTriangle,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Download,
  Settings
} from 'lucide-react';

// Mock data
const dashboardData = {
  today: {
    revenue: 12450.75,
    vehicles: 342,
    violations: 23,
    occupancy: 78
  },
  zones: [
    { name: 'Centro', occupancy: 85, vehicles: 156, revenue: 4200.50 },
    { name: 'Comércio', occupancy: 72, vehicles: 98, revenue: 2950.25 },
    { name: 'Residencial', occupancy: 65, vehicles: 88, revenue: 2100.00 }
  ],
  recentViolations: [
    { plate: 'ABC-1234', time: '14:32', zone: 'Centro', reason: 'Tempo expirado' },
    { plate: 'XYZ-5678', time: '14:15', zone: 'Comércio', reason: 'Não pago' },
    { plate: 'DEF-9012', time: '13:58', zone: 'Centro', reason: 'Tempo expirado' }
  ],
  hourlyData: [
    { hour: '08:00', vehicles: 45, revenue: 315.50 },
    { hour: '09:00', vehicles: 78, revenue: 546.75 },
    { hour: '10:00', vehicles: 92, revenue: 644.25 },
    { hour: '11:00', vehicles: 105, revenue: 735.00 },
    { hour: '12:00', vehicles: 88, revenue: 616.00 },
    { hour: '13:00', vehicles: 96, revenue: 672.50 },
    { hour: '14:00', vehicles: 82, revenue: 574.25 }
  ]
};

export function AdminDashboard() {
  const [selectedZone, setSelectedZone] = useState('all');

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = "primary" 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-accent flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Zona Azul</h1>
          <p className="text-muted-foreground">Painel de Controle Administrativo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita Hoje"
          value={`R$ ${dashboardData.today.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="+12.5% vs ontem"
          color="accent"
        />
        <StatCard
          title="Veículos Ativos"
          value={dashboardData.today.vehicles}
          icon={Car}
          trend="+8.3% vs ontem"
          color="primary"
        />
        <StatCard
          title="Autuações"
          value={dashboardData.today.violations}
          icon={AlertTriangle}
          trend="-5.2% vs ontem"
          color="warning"
        />
        <StatCard
          title="Ocupação Média"
          value={`${dashboardData.today.occupancy}%`}
          icon={BarChart3}
          trend="+2.1% vs ontem"
          color="accent"
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="zones">Zonas</TabsTrigger>
          <TabsTrigger value="violations">Autuações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Atividade por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.hourlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{data.hour}</div>
                          <div className="text-sm text-muted-foreground">{data.vehicles} veículos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">
                          R$ {data.revenue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Status das Zonas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.zones.map((zone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{zone.name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {zone.vehicles} veículos
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-accent">
                          R$ {zone.revenue.toFixed(2)}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-primary"
                          style={{ width: `${zone.occupancy}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ocupação: {zone.occupancy}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardData.zones.map((zone, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-card-blue transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {zone.name}
                    </div>
                    <Badge variant={zone.occupancy > 80 ? "destructive" : zone.occupancy > 60 ? "default" : "secondary"}>
                      {zone.occupancy}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Veículos:</span>
                      <div className="font-bold text-lg">{zone.vehicles}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Receita:</span>
                      <div className="font-bold text-lg text-accent">
                        R$ {zone.revenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-primary"
                      style={{ width: `${zone.occupancy}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Autuações Recentes
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {dashboardData.recentViolations.length} autuações registradas hoje
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentViolations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                        <Car className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <div className="font-mono font-bold">{violation.plate}</div>
                        <div className="text-sm text-muted-foreground">
                          {violation.zone} • {violation.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        {violation.reason}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Relatórios Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Diário
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Semanal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Mensal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório de Autuações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Fiscais Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'João Silva', zone: 'Centro', violations: 8 },
                    { name: 'Maria Santos', zone: 'Comércio', violations: 6 },
                    { name: 'Pedro Lima', zone: 'Residencial', violations: 4 }
                  ].map((fiscal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-semibold">{fiscal.name}</div>
                        <div className="text-sm text-muted-foreground">{fiscal.zone}</div>
                      </div>
                      <Badge variant="outline">
                        {fiscal.violations} autuações
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}