"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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

import { type DailyStandupConfig } from "@/lib/mock-data";

interface EditConfigDialogProps {
  config: DailyStandupConfig;
  channelName: string;
  onSave: (updatedConfig: DailyStandupConfig) => void;
  children: React.ReactNode;
}

type FormData = {
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

export default function EditConfigDialog({
  config,
  channelName,
  onSave,
  children,
}: EditConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      message: config.message,
      time: config.time,
      frequency: config.frequency,
      isActive: config.isActive,
    },
  });

  const watchedFrequency = watch("frequency");

  useEffect(() => {
    if (open) {
      reset({
        message: config.message,
        time: config.time,
        frequency: config.frequency,
        isActive: config.isActive,
      });
    }
  }, [open, config, reset]);

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
    const updatedConfig: DailyStandupConfig = {
      ...config,
      message: data.message,
      time: data.time,
      frequency: data.frequency,
      isActive: data.isActive,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedConfig);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Configuração do Daily Standup</DialogTitle>
          <DialogDescription>
            Configuração do canal #{channelName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
