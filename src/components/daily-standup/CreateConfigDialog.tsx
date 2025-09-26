"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Hash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type DailyStandupConfig, type SlackChannel } from "@/lib/mock-data";

interface CreateConfigDialogProps {
  availableChannels: SlackChannel[];
  onSave: (newConfig: Omit<DailyStandupConfig, "id">) => void;
  children: React.ReactNode;
}

type FormData = {
  channelId: string;
  message: string;
  time: string;
  frequency: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  isActive: boolean;
};

const DAYS_OF_WEEK = [
  { value: "monday" as const, label: "Segunda" },
  { value: "tuesday" as const, label: "Terça" },
  { value: "wednesday" as const, label: "Quarta" },
  { value: "thursday" as const, label: "Quinta" },
  { value: "friday" as const, label: "Sexta" },
];

const DEFAULT_MESSAGE = `🌅 Bom dia, equipe! Hora do daily standup:

1. **O que você fez ontem?**
2. **No que vai trabalhar hoje?**
3. **Algum impedimento ou bloqueio?**

Por favor, respondam até às 10h! 🚀`;

export default function CreateConfigDialog({
  availableChannels,
  onSave,
  children,
}: CreateConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      channelId: "",
      message: DEFAULT_MESSAGE,
      time: "09:00",
      frequency: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      isActive: true,
    },
  });

  const watchedFrequency = watch("frequency");
  const watchedChannelId = watch("channelId");

  useEffect(() => {
    if (open) {
      reset({
        channelId: "",
        message: DEFAULT_MESSAGE,
        time: "09:00",
        frequency: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        isActive: true,
      });
    }
  }, [open, reset]);

  const handleFrequencyChange = (
    day: (typeof DAYS_OF_WEEK)[0]["value"],
    checked: boolean
  ) => {
    const currentFrequency = watchedFrequency || [];
    if (checked) {
      setValue("frequency", [...currentFrequency, day]);
    } else {
      setValue(
        "frequency",
        currentFrequency.filter((d) => d !== day)
      );
    }
  };

  const onSubmit = (data: FormData) => {
    const newConfig = {
      channelId: data.channelId,
      message: data.message,
      time: data.time,
      frequency: data.frequency,
      timezone: "America/Sao_Paulo",
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newConfig);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const selectedChannel = availableChannels.find(
    (c) => c.id === watchedChannelId
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Configuração de Daily Standup</DialogTitle>
          <DialogDescription>
            Configure um novo daily standup para um canal do Slack
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção do Canal */}
          <div className="space-y-2">
            <Label htmlFor="channelId">Canal do Slack</Label>
            <Select
              value={watchedChannelId}
              onValueChange={(value) => setValue("channelId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um canal">
                  {selectedChannel && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>{selectedChannel.name}</span>
                      {selectedChannel.isPrivate && (
                        <Badge variant="secondary" className="text-xs">
                          Privado
                        </Badge>
                      )}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>{channel.name}</span>
                      <span className="text-muted-foreground text-sm">
                        ({channel.memberCount} membros)
                      </span>
                      {channel.isPrivate && (
                        <Badge variant="secondary" className="text-xs">
                          Privado
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selecione o canal onde o daily standup será configurado
            </p>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem do Daily Standup</Label>
            <Textarea
              id="message"
              placeholder="Digite a mensagem que será enviada no daily standup..."
              rows={6}
              {...register("message", { required: true })}
            />
            <p className="text-xs text-muted-foreground">
              Esta mensagem será enviada aos membros do canal nos dias e horário
              configurados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horário */}
            <div className="space-y-2">
              <Label htmlFor="time">Horário de Envio</Label>
              <Input
                id="time"
                type="time"
                {...register("time", { required: true })}
              />
              <p className="text-xs text-muted-foreground">
                Horário no fuso brasileiro (UTC-3)
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status da Configuração</Label>
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox id="isActive" {...register("isActive")} />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Configuração ativa
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas configurações ativas enviarão mensagens automaticamente
              </p>
            </div>
          </div>

          {/* Frequência */}
          <div className="space-y-3">
            <Label>Frequência de Envio</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected =
                  watchedFrequency?.includes(day.value) || false;
                return (
                  <Badge
                    key={day.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer select-none transition-colors hover:bg-primary/80 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() =>
                      handleFrequencyChange(day.value, !isSelected)
                    }
                  >
                    {day.label}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Clique nos dias da semana em que o daily standup será enviado
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!watchedChannelId}>
              Criar Configuração
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
