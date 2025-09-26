"use client";

import { useState } from "react";
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

import {
  getChannelsWithConfig,
  getConfigByChannelId,
  mockUsers,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const channelsWithConfig = getChannelsWithConfig();

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Daily Standups Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Gerencie suas configurações de daily standups e acompanhe o
          engajamento da equipe
        </p>
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
            <div className="text-2xl font-bold">
              {channelsWithConfig.length}
            </div>
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
            <div className="text-2xl font-bold">84%</div>
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
            <div className="text-2xl font-bold">{mockUsers.length}</div>
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Configuração
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelsWithConfig.map((channel) => {
            const config = getConfigByChannelId(channel.id);

            return (
              <Link key={channel.id} href={`/dashboard/channel/${channel.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        {channel.name}
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
                          {config.frequency.join(", ")}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant={config.isActive ? "default" : "secondary"}
                          >
                            {config.isActive ? "Ativo" : "Inativo"}
                          </Badge>

                          <div className="flex -space-x-2">
                            {mockUsers.slice(0, 3).map((user, index) => (
                              <Avatar
                                key={user.id}
                                className="w-6 h-6 border-2 border-background"
                              >
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.displayName}
                                />
                                <AvatarFallback className="text-xs">
                                  {user.displayName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
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
