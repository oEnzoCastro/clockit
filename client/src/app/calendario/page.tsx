"use client";

import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import Image from "next/image";
import backDay from "../../../public/back-day.svg";
import Cancel from "../../../public/x.svg";

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const ALTURA_HORA = 60;
const HORA_INICIO_PADRAO = 7;
const HORA_FIM_PADRAO = 18;

type AgentSchedule = {
  schedule_day: string;
  schedule: string;
};

type AgentDetail = {
  id: string;
  first_name: string;
  surname?: string;
  sector_region?: string | null;
  sector_location?: string | null;
  schedules: AgentSchedule[];
};

type SectorDetailsResponse = {
  id: string;
  acronym?: string;
  sector_name: string;
  agents: AgentDetail[];
};

type DayScheduleAPI = {
  agent_id: string;
  sector_id: string;
  schedule_day: "SEG" | "TER" | "QUA" | "QUI" | "SEX";
  schedule: string;
  sector_name: string;
  sector_acronym?: string;
};

type Monitoria = {
  dia: number;
  inicio: number;
  fim: number;
  nome: string;
  acronimo?: string;
  cor: string;
  sector_id: string;
  schedule_day: string;
};

type MonitoriaLayout = Monitoria & {
  coluna: number;
  totalColunas: number;
};

const CORES_PASTEL = [
  "#BBDEFB",
  "#C8E6C9",
  "#FFE0B2",
  "#F8BBD0",
  "#D1C4E9",
  "#B2DFDB",
  "#FFF9C4",
  "#DCEDC8",
  "#FFCCBC",
  "#CFD8DC",
];

const diaMap: Record<string, number> = {
  DOM: 0,
  SEG: 1,
  TER: 2,
  QUA: 3,
  QUI: 4,
  SEX: 5,
  SAB: 6,
};

function calcularFaixaHoras(monitorias: Monitoria[]) {
  if (!monitorias.length) {
    return {
      horaInicio: HORA_INICIO_PADRAO,
      horaFim: HORA_FIM_PADRAO,
    };
  }

  const menorInicio = Math.min(...monitorias.map((m) => Math.floor(m.inicio)));
  const maiorFim = Math.max(...monitorias.map((m) => Math.ceil(m.fim)));

  return {
    horaInicio: Math.min(HORA_INICIO_PADRAO, menorInicio),
    horaFim: Math.max(HORA_FIM_PADRAO, maiorFim),
  };
}

function gerarIndiceCor(chave: string) {
  let hash = 0;

  for (let i = 0; i < chave.length; i++) {
    hash = chave.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % CORES_PASTEL.length;
}

function corDaMateria(chave: string) {
  return CORES_PASTEL[gerarIndiceCor(chave)];
}

function horaParaDecimal(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h + m / 60;
}

function parseSchedule(schedule: string) {
  return schedule.split("|").map((faixa) => {
    const [inicio, fim] = faixa.split("-");
    return {
      inicio: horaParaDecimal(inicio),
      fim: horaParaDecimal(fim),
    };
  });
}

function unirIntervalos(intervalos: { inicio: number; fim: number }[]) {
  if (!intervalos.length) return [];

  const ordenados = [...intervalos].sort((a, b) => a.inicio - b.inicio);
  const resultado = [{ ...ordenados[0] }];

  for (let i = 1; i < ordenados.length; i++) {
    const atual = ordenados[i];
    const ultimo = resultado[resultado.length - 1];

    if (atual.inicio <= ultimo.fim) {
      ultimo.fim = Math.max(ultimo.fim, atual.fim);
    } else {
      resultado.push({ ...atual });
    }
  }

  return resultado;
}

function gerarMonitoriasDoBanco(data: DayScheduleAPI[]): Monitoria[] {
  const grupos = new Map<
    string,
    {
      sector_id: string;
      schedule_day: string;
      nome: string;
      acronimo?: string;
      dia: number;
      cor: string;
      intervalos: { inicio: number; fim: number }[];
    }
  >();

  data.forEach((item) => {
    const dia = diaMap[item.schedule_day];
    const nome = item.sector_name;
    const acronimo = item.sector_acronym;
    const chave = `${item.sector_id}-${dia}`;

    if (!grupos.has(chave)) {
      grupos.set(chave, {
        sector_id: item.sector_id,
        schedule_day: item.schedule_day,
        nome,
        acronimo,
        dia,
        cor: corDaMateria(item.sector_id),
        intervalos: [],
      });
    }

    const grupo = grupos.get(chave)!;
    grupo.intervalos.push(...parseSchedule(item.schedule));
  });

  const resultado: Monitoria[] = [];

  grupos.forEach((grupo) => {
    const intervalosUnidos = unirIntervalos(grupo.intervalos);

    intervalosUnidos.forEach((intervalo) => {
      resultado.push({
        sector_id: grupo.sector_id,
        schedule_day: grupo.schedule_day,
        dia: grupo.dia,
        inicio: intervalo.inicio,
        fim: intervalo.fim,
        nome: grupo.nome,
        acronimo: grupo.acronimo,
        cor: grupo.cor,
      });
    });
  });

  return resultado;
}

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

function today(data: Date) {
  const now = new Date();
  return (
    data.getDate() === now.getDate() &&
    data.getMonth() === now.getMonth() &&
    data.getFullYear() === now.getFullYear()
  );
}

function quebrarFaixasHorario(schedule: string) {
  return schedule.split("|").map((faixa) => {
    const [inicio, fim] = faixa.split("-");
    return { inicio, fim };
  });
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
        (existente) => m.inicio < existente.fim && m.fim > existente.inicio
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
  const [inicioSemana, setInicioSemana] = useState(inicioDaSemana(new Date()));
  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [monitoriaSelecionada, setMonitoriaSelecionada] = useState<Monitoria | null>(null);
  const [detalhesMateria, setDetalhesMateria] = useState<SectorDetailsResponse | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const { horaInicio, horaFim } = calcularFaixaHoras(monitorias);
  const horas = Array.from(
    { length: horaFim - horaInicio + 1 },
    (_, i) => horaInicio + i
  );

  async function abrirDetalhesMonitoria(monitoria: Monitoria) {
    try {
      setMonitoriaSelecionada(monitoria);
      setModalAberto(true);
      setCarregandoDetalhes(true);

      const response = await fetch(
        `http://localhost:5000/agentSectors/details?sector_id=${monitoria.sector_id}&schedule_day=${monitoria.schedule_day}`
      );

      const json = await response.json();

      if (json.success) {
        if (Array.isArray(json.data) && json.data.length > 0) {
          setDetalhesMateria(json.data[0]);
        } else if (json.data) {
          setDetalhesMateria(json.data);
        } else {
          setDetalhesMateria(null);
        }
      } else {
        setDetalhesMateria(null);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da monitoria:", error);
      setDetalhesMateria(null);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  function fecharModal() {
    setModalAberto(false);
    setMonitoriaSelecionada(null);
    setDetalhesMateria(null);
  }

  useEffect(() => {
    async function carregarMonitorias() {
      try {
        const response = await fetch("http://localhost:5000/daySchedules/get");
        const json = await response.json();
        console.log(json.data);

        if (json.success && Array.isArray(json.data)) {
          const monitoriasFormatadas = gerarMonitoriasDoBanco(json.data);
          setMonitorias(monitoriasFormatadas);
        } else {
          setMonitorias([]);
        }
      } catch (error) {
        console.error("Erro ao buscar monitorias:", error);
        setMonitorias([]);
      } finally {
        setLoading(false);
      }
    }

    carregarMonitorias();
  }, []);

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
  const datasSemana = dias.map((_, i) => adicionarDias(inicioSemana, i));

  return (
    <div className={styles.calendario}>
      <div className={styles.calendarioMes}>
        <div className={styles.mesSeta} onClick={semanaAnterior}>←</div>
        <div className={styles.mesTitulo}>{mesLabel}</div>
        <div className={styles.mesSeta} onClick={proximaSemana}>→</div>
      </div>

      <div className={styles.calendarioHeader}>
        <div className={styles.voltarDia} onClick={irParaHoje}>
          <Image src={backDay} alt="Hoje" width={24} height={24} />
        </div>

        <div className={styles.diasSemana}>
          {datasSemana.map((data, i) => (
            <div
              key={i}
              className={`${styles.diaHeader} ${today(data) ? styles.diaHoje : ""}`}
            >
              <div className={styles.diaNome}>{dias[i]}</div>
              <div className={styles.diaNumero}>{data.getDate()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.calendarioScroll}>
        <div className={styles.calendarioBody}>
          <div className={styles.colunaHoras}>
            {horas.map((h) => (
              <div key={h} className={styles.hora}>
                {h}:00
              </div>
            ))}
          </div>

          <div className={styles.grade}>
            {dias.map((_, diaIndex) => {
              const monitoriasDia = monitorias.filter((m) => m.dia === diaIndex);
              const monitoriasLayout = calcularLayoutMonitorias(monitoriasDia);

              return (
                <div key={diaIndex} className={styles.colunaDia}>
                  {horas.map((h) => (
                    <div key={h} className={styles.celula}></div>
                  ))}

                  {monitoriasLayout.map((m, idx) => {
                    const top = (m.inicio - horaInicio) * ALTURA_HORA;
                    const height = (m.fim - m.inicio) * ALTURA_HORA;
                    const width = 100 / m.totalColunas;
                    const left = m.coluna * width;

                    return (
                      <div
                        key={idx}
                        className={styles.monitoria}
                        onClick={() => abrirDetalhesMonitoria(m)}
                        style={{
                          top,
                          height,
                          width: `${width}%`,
                          left: `${left}%`,
                          backgroundColor: m.cor,
                          cursor: "pointer",
                        }}
                      >
                        <div className={styles.monitoriaConteudo}>
                          <strong>{m.acronimo || m.nome}</strong>
                          <span>{m.nome}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {loading && <p className={styles.calendarioLoading}>Carregando horários...</p>}

      {modalAberto && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modalMonitoria} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalName}>
                <h2>{monitoriaSelecionada?.nome} | {monitoriaSelecionada?.acronimo}</h2>
              </div>
              <button className={styles.modalFechar} onClick={fecharModal}>
                <Image className={styles.cancel} src={Cancel} alt="Cancel" />
              </button>
            </div>

            {carregandoDetalhes ? (
              <p className={styles.modalLoading}>Carregando detalhes...</p>
            ) : detalhesMateria?.agents?.length ? (
              <div className={styles.modalLista}>
                {detalhesMateria.agents.map((agent) => (
                  <div key={agent.id} className={styles.modalCardMonitor}>
                    <div className={styles.modalMonitorNome}>
                      {agent.first_name} {agent.surname || ""}
                    </div>

                    <div className={styles.modalMonitorInfo}>
                      <p>
                        Região: {agent.sector_region || "Não informado"}
                      </p>
                      <p>
                        Local: {agent.sector_location || "Não informado"}
                      </p>
                    </div>

                    <div className={styles.modalHorarios}>
                      {agent.schedules
                        .filter((s) => s.schedule_day === monitoriaSelecionada?.schedule_day)
                        .flatMap((s) =>
                          quebrarFaixasHorario(s.schedule).map((faixa, index) => (
                            <div
                              key={`${agent.id}-${s.schedule_day}-${index}`}
                              className={styles.modalFaixa}
                            >
                              <p>Início: {faixa.inicio}</p>
                              <p>Fim: {faixa.fim}</p>
                            </div>
                          ))
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.modalVazio}>Nenhum detalhe encontrado para essa matéria.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}