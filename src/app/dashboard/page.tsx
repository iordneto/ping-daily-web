"use client";
import Link from "next/link";
import {
  Hash,
  Users,
  Settings,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

import CreateConfigDialog from "@/components/daily-standup/CreateConfigDialog";
import useDashboardData, {
  type AvailableChannel,
} from "@/module/dashboard/services/useDashboardData";

export default function DashboardPage() {
  const { data: dashboardData, loading, error, refetch } = useDashboardData();

  const handleConfigCreate = (newConfig: any) => {
    // TODO: Implement API call to create configuration
    // For now, refetch data to update the dashboard
    refetch();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <LoadingSpinner message="Carregando dados do dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ErrorDisplay error={error} className="max-w-lg mx-auto" />
        <div className="text-center mt-4">
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Nenhum dado encontrado.</p>
      </div>
    );
  }

  const { stats, channelsWithConfig, availableChannels } = dashboardData;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <h1 className="text-4xl font-bold text-primary tracking-wider">
            TACTICAL DAILY OPS
          </h1>
        </div>
        <p className="text-muted-foreground text-lg font-medium">
          SISTEMA DE CONTROLE E MONITORAMENTO DE DAILY STANDUPS
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>STATUS: OPERACIONAL</span>
          <span>•</span>
          <span>UPTIME: 99.9%</span>
          <span>•</span>
          <span>ÚLTIMA ATUALIZAÇÃO: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Canais Configurados
            </CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.configuredChannels}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Resposta
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% desde a semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membros Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Participando dos dailies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channels List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Canais Configurados</h2>
          {availableChannels.length > 0 ? (
            <CreateConfigDialog
              availableChannels={availableChannels.map(
                (channel: AvailableChannel) => ({
                  id: channel.id,
                  name: channel.name,
                  displayName: channel.name,
                  memberCount: channel.num_members,
                  isPrivate: channel.is_private,
                  hasConfiguration: false,
                })
              )}
              onSave={handleConfigCreate}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Configuração
              </Button>
            </CreateConfigDialog>
          ) : (
            <div className="text-right">
              <Button disabled>
                <Plus className="w-4 h-4 mr-2" />
                Nova Configuração
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os canais já possuem configuração
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelsWithConfig.map((channel) => {
            const config = channel.config;

            return (
              <Link key={channel.id} href={`/dashboard/channel/${channel.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        {channel.displayName || channel.name}
                      </CardTitle>
                      {channel.isPrivate && (
                        <Badge variant="secondary">Privado</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {channel.memberCount} membros
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {config && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {config.time} • {config.frequency.length}x por semana
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {config.frequency
                            .map((day: string) => {
                              const dayMap: Record<string, string> = {
                                monday: "Seg",
                                tuesday: "Ter",
                                wednesday: "Qua",
                                thursday: "Qui",
                                friday: "Sex",
                                saturday: "Sáb",
                                sunday: "Dom",
                              };
                              return dayMap[day] || day;
                            })
                            .join(", ")}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant={config.isActive ? "default" : "secondary"}
                          >
                            {config.isActive ? "Ativo" : "Inativo"}
                          </Badge>

                          <div className="flex -space-x-2">
                            {/* Display member avatars - using placeholders since we don't have user data from API yet */}
                            {Array.from({
                              length: Math.min(3, channel.memberCount),
                            }).map((_, index) => (
                              <Avatar
                                key={index}
                                className="w-6 h-6 border-2 border-background"
                              >
                                <AvatarFallback className="text-xs">
                                  {String.fromCharCode(65 + index)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {channel.memberCount > 3 && (
                              <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">
                                  +{channel.memberCount - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
