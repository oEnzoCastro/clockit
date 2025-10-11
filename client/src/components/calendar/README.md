# Calendário Semanal - WeeklyCalendar

## Descrição
Componente de calendário semanal para visualização de eventos, com suporte a eventos únicos e recorrentes.

## Características

### ✅ Implementado
- **Visualização Semanal**: Exibe 7 dias (Segunda a Domingo)
- **Navegação**: 
  - Botões para semana anterior/próxima
  - Botão "Hoje" para voltar à semana atual
  - Seletor de data para pular para qualquer semana
- **Eventos Únicos**: Eventos que ocorrem apenas uma vez (bordas sólidas)
- **Eventos Recorrentes**: Eventos que se repetem semanalmente (bordas tracejadas)
- **Mesclagem de Eventos**: Eventos do mesmo tema no mesmo horário são mesclados automaticamente
- **Sobreposição**: Eventos de temas diferentes são exibidos lado a lado
- **Scroll Automático**: O calendário foca automaticamente nas 7:00 da manhã
- **Destaque do Dia Atual**: O número do dia atual é destacado com um círculo azul
- **Paleta de Cores Acessível**: 15 cores distintas para daltônicos
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Compressão Inteligente**: Quando há múltiplos eventos sobrepostos, o conteúdo se adapta

### 🎨 Elementos Visuais
- **Eventos Únicos**: Borda esquerda sólida
- **Eventos Recorrentes**: Borda esquerda tracejada
- **Eventos Mesclados**: Mostra "(X)" indicando quantidade de eventos mesclados
- **Horário Completo**: Exibe de 00:00 a 23:59

## Como Usar

### Importação
```tsx
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import Event from "@/models/event";
```

### Uso Básico
```tsx
export default function Page() {
  const events: Event[] = [
    {
      event_id: "1",
      event_title: "Aula de Matemática",
      event_description: "Cálculo I",
      event_location: "Sala 101",
      event_recurrence: null, // Evento único
      event_start_date: new Date("2025-10-13T08:00:00"),
      event_end_date: new Date("2025-10-13T10:00:00"),
      agent_name: "Prof. Silva",
      theme_name: "Matemática",
      theme_abbreviation: "MAT",
      sector_name: "Exatas",
      sector_abbreviation: "EX",
      institute_name: "Instituto Central",
    },
    // ... mais eventos
  ];

  return (
    <div style={{ height: '100vh' }}>
      <WeeklyCalendar events={events} />
    </div>
  );
}
```

### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `events` | `Event[]` | ✅ Sim | Array de eventos a serem exibidos no calendário |
```

## Estrutura de Dados

### Tipo Event
```typescript
type Event = {
  event_id: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_recurrence: string | null;  // null = evento único, não-null = recorrente
  event_start_date: Date;
  event_end_date: Date;
  agent_name: string;
  theme_name: string;
  theme_abbreviation: string;
  sector_name: string;
  sector_abbreviation: string;
  institute_name: string;
};
```

### Eventos Únicos vs Recorrentes

**Evento Único** (`event_recurrence: null`):
- Ocorre apenas uma vez na data especificada
- `event_start_date` e `event_end_date` contêm data e hora completas

**Evento Recorrente** (`event_recurrence: não-null`):
- Repete-se semanalmente no mesmo dia da semana
- `event_start_date` e `event_end_date` são usados para determinar:
  - Dia da semana (extraído da data)
  - Horários (hora e minuto)

## Funcionalidades Interativas

### Navegação
1. **Semana Anterior/Próxima**: Botões de navegação
2. **Hoje**: Volta para a semana atual
3. **Seletor de Data**: Clique para escolher qualquer data e pular para aquela semana

### Interação com Eventos
- **Clique em Evento**: Registra os dados do evento no console
- **Hover**: Evento se eleva ligeiramente com sombra

## Paleta de Cores
As cores foram escolhidas para serem distinguíveis por pessoas com daltonismo:
1. Preto (#000000)
2. Laranja (#E69F00)
3. Azul Céu (#56B4E9)
4. Verde (#009E73)
5. Amarelo (#F0E442)
6. Azul (#0072B2)
7. Vermelho-Laranja (#D55E00)
8. Rosa (#CC79A7)
9. Cinza (#999999)
10. Marrom (#8B4513)
11. Rosa Choque (#FF69B4)
12. Verde-Água (#20B2AA)
13. Tomate (#FF6347)
14. Azul Royal (#4169E1)
15. Verde-Lima (#32CD32)

## Exemplo de Mock Data
```typescript
const mockEvent: Event = {
  event_id: '1',
  event_title: 'Aula de Matemática',
  event_description: 'Cálculo I',
  event_location: 'Sala 101',
  event_recurrence: null,  // Evento único
  event_start_date: new Date('2025-10-13T08:00:00'),
  event_end_date: new Date('2025-10-13T10:00:00'),
  agent_name: 'Prof. Silva',
  theme_name: 'Matemática',
  theme_abbreviation: 'MAT',
  sector_name: 'Exatas',
  sector_abbreviation: 'EX',
  institute_name: 'Instituto Central'
};
```

## Próximos Passos (Para Consulta)
- Integração com API/Backend
- Modal de detalhes do evento
- Filtros por tema/setor
- Exportação para calendário (iCal)
- Modo escuro
- Arrastar e soltar eventos
- Criar novos eventos
- Editar eventos existentes

## Observações
- O componente usa dados mockados (5 eventos de teste)
- Para usar dados reais, substitua o array `mockEvents` por dados da sua API
- O scroll automático foca em 7:00 da manhã ao carregar
- Todos os textos estão em português (PT-BR)
