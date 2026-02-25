"use client";

import React, { useState } from "react";
import "./style.css";
import Image from "next/image";
import backDay from "../../../public/back-day.svg";

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const horas = Array.from({ length: 12 }, (_, i) => 7 + i);

const HORA_INICIO = 7;
const ALTURA_HORA = 60;

type Monitoria = {
  dia: number;
  inicio: number;
  fim: number;
  cor: string;
  nome: string;
};

type MonitoriaLayout = Monitoria & {
  coluna: number;
  totalColunas: number;
};

const monitorias: Monitoria[] = [
  { dia: 1, inicio: 9, fim: 12, cor: "monitoria-verde", nome: "Cálculo" },
  { dia: 1, inicio: 10, fim: 13, cor: "monitoria-laranja", nome: "Física" },
  { dia: 1, inicio: 11, fim: 14, cor: "monitoria-verde", nome: "BD" },
  { dia: 2, inicio: 9, fim: 11, cor: "monitoria-verde", nome: "Algoritmos" },
];

/* ================= DATE UTILS ================= */

function inicioDaSemana(data: Date) {
  const d = new Date(data);
  const dia = d.getDay();
  d.setDate(d.getDate() - dia);
  d.setHours(0, 0, 0, 0);
  return d;
}

function adicionarDias(data: Date, dias: number) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

function mesDaSemana(dataInicio: Date) {
  const meio = adicionarDias(dataInicio, 3);
  return meio.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

/* hoje */
function today(data: Date) {
  const now = new Date();
  return (
    data.getDate() === now.getDate() &&
    data.getMonth() === now.getMonth() &&
    data.getFullYear() === now.getFullYear()
  );
}

/* ================= LAYOUT ================= */

function calcularLayoutMonitorias(
  monitoriasDia: Monitoria[]
): MonitoriaLayout[] {
  const colunas: Monitoria[][] = [];

  monitoriasDia.forEach((m) => {
    let colunaEncontrada = -1;

    for (let i = 0; i < colunas.length; i++) {
      const temSobreposicao = colunas[i].some(
        (existente) =>
          m.inicio < existente.fim && m.fim > existente.inicio
      );

      if (!temSobreposicao) {
        colunaEncontrada = i;
        break;
      }
    }

    if (colunaEncontrada === -1) {
      colunas.push([m]);
      colunaEncontrada = colunas.length - 1;
    } else {
      colunas[colunaEncontrada].push(m);
    }
  });

  const totalColunas = colunas.length;
  const resultado: MonitoriaLayout[] = [];

  colunas.forEach((coluna, colunaIndex) => {
    coluna.forEach((m) => {
      resultado.push({
        ...m,
        coluna: colunaIndex,
        totalColunas,
      });
    });
  });

  return resultado;
}

/* ================= COMPONENT ================= */

export default function Calendario() {
  const [inicioSemana, setInicioSemana] = useState(
    inicioDaSemana(new Date())
  );

  function semanaAnterior() {
    setInicioSemana((prev) => adicionarDias(prev, -7));
  }

  function proximaSemana() {
    setInicioSemana((prev) => adicionarDias(prev, 7));
  }

  function irParaHoje() {
  setInicioSemana(inicioDaSemana(new Date()));
}

  const mesLabel = mesDaSemana(inicioSemana);

  const datasSemana = dias.map((_, i) =>
    adicionarDias(inicioSemana, i)
  );

  return (
    <div className="calendario">
      <div className="calendario-mes">
        <div className="mes-seta" onClick={semanaAnterior}>
          ←
        </div>

        <div className="mes-titulo">{mesLabel}</div>

        <div className="mes-seta" onClick={proximaSemana}>
          →
        </div>
      </div>

      <div className="calendario-header">
        <div className="voltar-dia" onClick={irParaHoje}>
          <Image src={backDay} alt="Hoje" width={24} height={24} />
        </div>

        <div className="dias-semana">
          {datasSemana.map((data, i) => (
            <div
              key={i}
              className={`dia-header ${today(data) ? "dia-hoje" : ""}`}
            >
              <div className="dia-nome">{dias[i]}</div>
              <div className="dia-numero">{data.getDate()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="calendario-scroll">
        <div className="calendario-body">
          <div className="coluna-horas">
            {horas.map((h) => (
              <div key={h} className="hora">
                {h}:00
              </div>
            ))}
          </div>

          <div className="grade">
            {dias.map((_, diaIndex) => {
              const monitoriasDia = monitorias.filter(
                (m) => m.dia === diaIndex
              );

              const monitoriasLayout =
                calcularLayoutMonitorias(monitoriasDia);

              return (
                <div key={diaIndex} className="coluna-dia">
                  {horas.map((h) => (
                    <div key={h} className="celula"></div>
                  ))}

                  {monitoriasLayout.map((m, idx) => {
                    const top =
                      (m.inicio - HORA_INICIO) * ALTURA_HORA;
                    const height =
                      (m.fim - m.inicio) * ALTURA_HORA;

                    const width = 100 / m.totalColunas;
                    const left = m.coluna * width;

                    return (
                      <div
                        key={idx}
                        className={`monitoria ${m.cor}`}
                        style={{
                          top,
                          height,
                          width: `${width}%`,
                          left: `${left}%`,
                        }}
                      >
                        {m.nome}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}