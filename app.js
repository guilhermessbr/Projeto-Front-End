// Funcoes auxiliares: reutilizam os recursos do arquivo original.
function buscar(id) {
    return document.getElementById(id);
}

function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function calcularDiarias(entrada, saida) {
    return Math.ceil((new Date(saida) - new Date(entrada)) / (1000 * 60 * 60 * 24));
}

function atualizarTelas() {
    renderizarCalendario();
    renderizarReservas();
    renderizarHistoricoHospedes();
}

function linhaInfo(rotulo, valor) {
    return `<div class="reserva-info-item">
        <span class="reserva-info-label">${rotulo}</span>
        <span class="reserva-info-value">${valor}</span>
    </div>`;
}

// Configuração inicial
const precos = {
    simples: 150,
    duplo: 250,
    suite: 450
};

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let reservas = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarReservas();
    inicializarEventos();
    atualizarTelas();
});

// Carregamento e salvamento de dados
function carregarReservas() {
    const dados = localStorage.getItem('reservasHotel');
    if (dados) {
        reservas = JSON.parse(dados);
    }
}

function salvarReservas() {
    localStorage.setItem('reservasHotel', JSON.stringify(reservas));
}

// Inicializar eventos
function inicializarEventos() {
    // Formulário de reserva
    const formReserva = buscar('formReserva');
    formReserva.addEventListener('submit', criarReserva);
    formReserva.addEventListener('reset', () => {
        buscar('totalReserva').value = 'R$ 0,00';
    });

    // Cálculo automático do total
    buscar('dataCheckin').addEventListener('change', calcularTotal);
    buscar('dataCheckout').addEventListener('change', calcularTotal);
    buscar('tipoQuarto').addEventListener('change', calcularTotal);

    // Navegação do calendário
    buscar('mesAnterior').addEventListener('click', mesAnterior);
    buscar('proximoMes').addEventListener('click', proximoMes);

    // Filtro de status
    buscar('filtroStatus').addEventListener('change', renderizarReservas);

    // Ações gerais
    buscar('btnLimparDados').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar TODOS os dados? Isso não pode ser desfeito!')) {
            reservas = [];
            salvarReservas();
            atualizarTelas();
            alert('Todos os dados foram limpos!');
        }
    });

    buscar('btnExportarDados').addEventListener('click', exportarReservas);
}

// Cálculo de total
function calcularTotal() {
    const dataCheckin = buscar('dataCheckin').value;
    const dataCheckout = buscar('dataCheckout').value;
    const tipoQuarto = buscar('tipoQuarto').value;

    if (!dataCheckin || !dataCheckout || !tipoQuarto) {
        buscar('totalReserva').value = 'R$ 0,00';
        return;
    }

    const dias = calcularDiarias(dataCheckin, dataCheckout);

    if (dias <= 0) {
        buscar('totalReserva').value = 'Data inválida';
        return;
    }

    const preco = precos[tipoQuarto];
    const total = dias * preco;

    buscar('totalReserva').value = `R$ ${formatarValor(total)}`;
}

// Criar reserva
function criarReserva(e) {
    e.preventDefault();

    const nomeHospede = buscar('nomeHospede').value.trim();
    const emailHospede = buscar('emailHospede').value.trim();
    const telefoneHospede = buscar('telefoneHospede').value.trim();
    const tipoQuarto = buscar('tipoQuarto').value;
    const dataCheckin = buscar('dataCheckin').value;
    const dataCheckout = buscar('dataCheckout').value;
    const numeroPessoas = parseInt(buscar('numeroPessoas').value);

    if (!nomeHospede || !emailHospede || !telefoneHospede || !tipoQuarto || !dataCheckin || !dataCheckout) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const dias = calcularDiarias(dataCheckin, dataCheckout);

    if (dias <= 0) {
        alert('Data de check-out deve ser posterior à data de check-in!');
        return;
    }

    const preco = precos[tipoQuarto];
    const total = dias * preco;

    // Criar objeto de reserva
    const reserva = {
        id: Date.now(),
        nomeHospede,
        emailHospede,
        telefoneHospede,
        tipoQuarto,
        dataCheckin,
        dataCheckout,
        numeroPessoas,
        dias,
        precoNoite: preco,
        total,
        status: 'confirmada',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
    };

    reservas.push(reserva);
    salvarReservas();

    alert(`✓ Reserva de ${nomeHospede} confirmada!\nTotal: R$ ${formatarValor(total)}`);

    buscar('formReserva').reset();
    buscar('totalReserva').value = 'R$ 0,00';

    atualizarTelas();
}

// Renderizar calendário
function renderizarCalendario() {
    const container = buscar('calendarioContainer');
    container.innerHTML = '';

    const mesAnome = new Date(anoAtual, mesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    buscar('mesAnoAtual').textContent = mesAnome.charAt(0).toUpperCase() + mesAnome.slice(1);

    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    const diasNoMes = ultimoDia.getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(anoAtual, mesAtual, dia);
        const dataFormatada = data.toISOString().split('T')[0];

        // Verificar se há reservas nesse dia
        const ocupacaoDia = verificarOcupacao(dataFormatada);

        const elemento = document.createElement('div');
        elemento.className = `quarto-item ${ocupacaoDia.classe}`;
        elemento.innerHTML = `
            <div class="quarto-item-title">${dia}</div>
            <div class="quarto-item-status">${ocupacaoDia.status}</div>
        `;

        container.appendChild(elemento);
    }
}

function verificarOcupacao(data) {
    let ocupada = false;
    let bloqueada = false;

    for (let reserva of reservas) {
        const checkin = new Date(reserva.dataCheckin);
        const checkout = new Date(reserva.dataCheckout);
        const dataVerificar = new Date(data);

        if (dataVerificar >= checkin && dataVerificar < checkout) {
            ocupada = true;
            break;
        }

        if (dataVerificar.toDateString() === checkin.toDateString() || dataVerificar.toDateString() === checkout.toDateString()) {
            bloqueada = true;
        }
    }

    if (ocupada) {
        return { classe: 'ocupado', status: 'Ocupado' };
    } else if (bloqueada) {
        return { classe: 'bloqueado', status: 'Check-in/out' };
    } else {
        return { classe: 'livre', status: 'Livre' };
    }
}

// Navegação do calendário
function mesAnterior() {
    if (mesAtual === 0) {
        mesAtual = 11;
        anoAtual--;
    } else {
        mesAtual--;
    }
    renderizarCalendario();
}

function proximoMes() {
    if (mesAtual === 11) {
        mesAtual = 0;
        anoAtual++;
    } else {
        mesAtual++;
    }
    renderizarCalendario();
}

// Renderizar reservas
function renderizarReservas() {
    const container = buscar('listaReservas');
    const filtroStatus = buscar('filtroStatus').value;
    
    let reservasFiltradas = reservas;
    
    if (filtroStatus) {
        reservasFiltradas = reservas.filter(r => r.status === filtroStatus);
    }

    container.innerHTML = '';

    if (reservasFiltradas.length === 0) {
        buscar('mensagemVazia').style.display = 'block';
        return;
    }

    buscar('mensagemVazia').style.display = 'none';

    reservasFiltradas.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';

        const dataCheckinFormatada = new Date(reserva.dataCheckin).toLocaleDateString('pt-BR');
        const dataCheckoutFormatada = new Date(reserva.dataCheckout).toLocaleDateString('pt-BR');

        card.innerHTML = `
            <h4>${reserva.nomeHospede}</h4>
            <div class="reserva-info">
                ${linhaInfo('Email:', `${reserva.emailHospede}`)}
                ${linhaInfo('Telefone:', `${reserva.telefoneHospede}`)}
                ${linhaInfo('Quarto:', `${capitalize(reserva.tipoQuarto)}`)}
                ${linhaInfo('Check-in:', `${dataCheckinFormatada}`)}
                ${linhaInfo('Check-out:', `${dataCheckoutFormatada}`)}
                ${linhaInfo('Pessoas:', `${reserva.numeroPessoas}`)}
                ${linhaInfo('Diárias:', `${reserva.dias} noite(s)`)}
                ${linhaInfo('Total:', `<strong>R$ ${formatarValor(reserva.total)}</strong>`)}
            </div>
            <span class="status-badge status-${reserva.status}">Status: ${capitalize(reserva.status)}</span>
            <div class="reserva-actions">
                <button class="btn-secondary" onclick="alterarStatus(${reserva.id})">📋 Alterar Status</button>
                <button class="btn-danger" onclick="cancelarReserva(${reserva.id})">❌ Cancelar</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Alterar status
function alterarStatus(idReserva) {
    const reserva = reservas.find(r => r.id === idReserva);
    if (!reserva) return;

    const proximoStatus = reserva.status === 'confirmada' ? 'checkin' : reserva.status === 'checkin' ? 'checkout' : 'confirmada';

    if (confirm(`Alterar status de "${reserva.nomeHospede}" para "${capitalize(proximoStatus)}"?`)) {
        reserva.status = proximoStatus;
        salvarReservas();
        atualizarTelas();
        alert('Status atualizado!');
    }
}

// Cancelar reserva
function cancelarReserva(idReserva) {
    const reserva = reservas.find(r => r.id === idReserva);
    if (!reserva) return;

    if (confirm(`Tem certeza que deseja cancelar a reserva de ${reserva.nomeHospede}?`)) {
        reservas = reservas.filter(r => r.id !== idReserva);
        salvarReservas();
        atualizarTelas();
        alert('Reserva cancelada!');
    }
}

// Histórico de hóspedes
function renderizarHistoricoHospedes() {
    const container = buscar('historicoHospedes');
    container.innerHTML = '';

    // Agrupar por hóspede
    const hospedes = {};
    reservas.forEach(reserva => {
        if (!hospedes[reserva.emailHospede]) {
            hospedes[reserva.emailHospede] = {
                nome: reserva.nomeHospede,
                email: reserva.emailHospede,
                telefone: reserva.telefoneHospede,
                totalReservas: 0,
                totalGasto: 0
            };
        }
        hospedes[reserva.emailHospede].totalReservas++;
        hospedes[reserva.emailHospede].totalGasto += reserva.total;
    });

    if (Object.keys(hospedes).length === 0) {
        buscar('mensagemHistoricoVazio').style.display = 'block';
        return;
    }

    buscar('mensagemHistoricoVazio').style.display = 'none';

    Object.values(hospedes).forEach(hospede => {
        const card = document.createElement('div');
        card.className = 'hospede-card';
        card.innerHTML = `
            <h4>${hospede.nome}</h4>
            <div class="reserva-info">
                ${linhaInfo('Email:', `${hospede.email}`)}
                ${linhaInfo('Telefone:', `${hospede.telefone}`)}
                ${linhaInfo('Total de Reservas:', `${hospede.totalReservas}`)}
                ${linhaInfo('Total Gasto:', `<strong>R$ ${formatarValor(hospede.totalGasto)}</strong>`)}
            </div>
        `;
        container.appendChild(card);
    });
}

// Exportar reservas
function exportarReservas() {
    if (reservas.length === 0) {
        alert('Não há reservas para exportar!');
        return;
    }

    let csv = 'Nome,Email,Telefone,Tipo Quarto,Check-in,Check-out,Diárias,Preço/Noite,Total,Status,Data Criação\n';

    reservas.forEach(reserva => {
        csv += `"${reserva.nomeHospede}","${reserva.emailHospede}","${reserva.telefoneHospede}","${reserva.tipoQuarto}","${reserva.dataCheckin}","${reserva.dataCheckout}","${reserva.dias}","${reserva.precoNoite}","${reserva.total}","${reserva.status}","${reserva.dataCriacao}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-hotel-${new Date().toLocaleDateString('pt-BR')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Reservas exportadas com sucesso!');
}

// Funções auxiliares
function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
