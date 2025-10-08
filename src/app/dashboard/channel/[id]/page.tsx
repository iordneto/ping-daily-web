"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Hash,
  Clock,
  Calendar,
  Settings,
  Eye,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  mockChannels,
  mockUsers,
  type DailyStandupConfig,
} from "@/lib/mock-data";

import EditConfigDialog from "@/components/daily-standup/EditConfigDialog";
import useGetChannelInfo from "@/module/channel/services/useGetChannelInfo";
import useGetChannelHistory, {
  DailyStandupHistory,
} from "@/module/channel/services/useGetChannelHistory";

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;

  const { data: channelInfo } = useGetChannelInfo(channelId);
  const config = channelInfo?.config;

  console.log(channelInfo);

  const channel = mockChannels[0];
  const { data: historyResponse } = useGetChannelHistory(channel.id);
  const history = historyResponse?.history;

  const [selectedHistory, setSelectedHistory] =
    useState<DailyStandupHistory | null>(null);

  const handleConfigSave = (updatedConfig: DailyStandupConfig) => {
    /* setConfig(updatedConfig); */
    // Aqui você faria a chamada para a API para salvar a configuração
    /* console.log("Configuração atualizada:", updatedConfig); */
  };

  if (!channel) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Canal não encontrado</h1>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "missed":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completa";
      case "partial":
        return "Parcial";
      case "missed":
        return "Perdida";
      default:
        return "N/A";
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Hash className="w-6 h-6" />
            <h1 className="text-3xl font-bold">{channel.name}</h1>
            {channel.isPrivate && <Badge variant="secondary">Privado</Badge>}
          </div>
        </div>

        <p className="text-muted-foreground">
          {channel.memberCount} membros • Daily Standup configurado
        </p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>

        {/* Histórico Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Daily Standups</CardTitle>
              <CardDescription>
                Clique em uma linha para ver detalhes das respostas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Taxa de Resposta</TableHead>
                    <TableHead>Respostas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedHistory(item)}
                    >
                      <TableCell className="font-medium">
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell>{formatTime(item.sentAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${item.responseRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {item.responseRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.responses.length}/{item.totalMembers}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Modal de Detalhes do Histórico */}
          {selectedHistory && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Daily Standup - {formatDate(selectedHistory.date)}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedHistory(null)}
                  >
                    Fechar
                  </Button>
                </div>
                <CardDescription>
                  Enviado às {formatTime(selectedHistory.sentAt)} •
                  {selectedHistory.responses.length}/
                  {selectedHistory.totalMembers} respostas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Respostas dos usuários */}
                <div>
                  <h4 className="font-semibold mb-4">Respostas dos Membros</h4>
                  <div className="space-y-4">
                    {selectedHistory.responses.map((response) => {
                      const user = mockUsers.find(
                        (u) => u.id === response.userId
                      );
                      return (
                        <div
                          key={response.userId}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={user?.avatar}
                                alt={user?.displayName}
                              />
                              <AvatarFallback className="text-xs">
                                {user?.displayName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{user?.displayName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatTime(response.timestamp)} •
                                <span
                                  className={getStatusColor(response.status)}
                                >
                                  {getStatusText(response.status)}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                            {response.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumo Compilado */}
                {selectedHistory.compiledMessage && (
                  <div>
                    <h4 className="font-semibold mb-4">Resumo Gerado</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedHistory.compiledMessage}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Configuração Tab */}
        <TabsContent value="config" className="space-y-6">
          {config ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuração Atual */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Configuração Atual</CardTitle>
                    <EditConfigDialog
                      config={config}
                      channelName={channel.name}
                      onSave={handleConfigSave}
                    >
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </EditConfigDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Horário:</span>
                    <span>{config.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Frequência:</span>
                    <div className="flex gap-1">
                      {config.frequency.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Status:</span>
                    <Badge variant={config.isActive ? "default" : "secondary"}>
                      {config.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <span className="font-medium block mb-2">Mensagem:</span>
                    <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                      {config.message}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma configuração encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Este canal ainda não possui uma configuração de daily standup.
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Daily
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Membros Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Membros do Canal</CardTitle>
              <CardDescription>
                {mockUsers.length} membros participando dos dailies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>
                        {user.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
