
class SearchableSelect {
    constructor(element) {
        this.element = element;
        this.selectType = element.dataset.select;
        this.button = element.querySelector('.select-button');
        this.selectedText = this.button.querySelector('.selected-text');
        this.arrow = element.querySelector('.arrow');
        this.dropdown = element.querySelector('.dropdown');
        this.searchInput = element.querySelector('.search-input');
        this.optionsContainer = element.querySelector('.options-container');
        
        this.isOpen = false;
        this.currentValue = '';
        this.options = Array.from(this.optionsContainer.querySelectorAll('.option'));
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstOption = this.optionsContainer.querySelector('.option:not(.hidden)');
                if (firstOption) {
                    this.selectOption(firstOption);
                }
            } else if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        this.options.forEach(option => {
            option.addEventListener('click', () => this.selectOption(option));
        });
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        // Fechar outros dropdowns
        document.querySelectorAll('.custom-select').forEach(select => {
            if (select !== this.element) {
                const instance = select.searchableSelectInstance;
                if (instance && instance.isOpen) {
                    instance.closeDropdown();
                }
            }
        });

        this.isOpen = true;
        this.dropdown.classList.remove('hidden');
        this.button.classList.add('active');
        this.arrow.classList.add('rotated');
        this.searchInput.focus();
        this.searchInput.value = '';
        this.showAllOptions();
    }

    closeDropdown() {
        this.isOpen = false;
        this.dropdown.classList.add('hidden');
        this.button.classList.remove('active');
        this.arrow.classList.remove('rotated');
    }

    selectOption(option) {
        const value = option.textContent;
        this.currentValue = value;
        this.selectedText.textContent = value;
        this.selectedText.classList.remove('placeholder');
        this.selectedText.classList.add('selected-value');
        
        // Atualizar o display de resultado
        const resultElement = document.getElementById(`selected${this.selectType.charAt(0).toUpperCase() + this.selectType.slice(1)}`);
        if (resultElement) {
            resultElement.textContent = value;
        }
        
        this.closeDropdown();
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        let hasResults = false;
        
        this.options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.style.display = '';
                hasResults = true;
            } else {
                option.style.display = 'none';
            }
        });

        // Gerenciar mensagem de "nenhum resultado encontrado"
        let noResultsMessage = this.optionsContainer.querySelector('.no-results-message');
        if (!hasResults) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message';
                noResultsMessage.textContent = 'Nenhum resultado encontrado';
                noResultsMessage.style.padding = '5px';
                noResultsMessage.style.color = '#666';
                this.optionsContainer.appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = '';
        } else if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }

    showAllOptions() {
        this.options.forEach(option => {
            option.style.display = '';
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const selectElements = document.querySelectorAll('.custom-select');
    
    selectElements.forEach(element => {
        const instance = new SearchableSelect(element);
        element.searchableSelectInstance = instance;
    });

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select')) {
            selectElements.forEach(element => {
                const instance = element.searchableSelectInstance;
                if (instance && instance.isOpen) {
                    instance.closeDropdown();
                }
            });
        }
    }); 

});

function abrirModal() {
    const loja = document.querySelector('[data-select="loja"] .selected-text').textContent;
    if(loja === 'Selecione uma loja') {
        toastr.error('Por favor, selecione uma loja antes de abrir o histórico.', 'Erro!', {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-right",
            preventDuplicates: true,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        });
    }
    else{
        const modal = document.getElementById('historicoModal');
        modal.classList.add('show');
        carregarAtendentes();
    }
    
}

function fecharModal() {
    const modal = document.getElementById('historicoModal');
    modal.classList.remove('show');
}

function abrirModalTaxas(){
    const loja = document.querySelector('[data-select="loja"] .selected-text').textContent;
    if(loja === 'Selecione uma loja') {
        toastr.error('Por favor, selecione uma loja antes de alterar as taxas.', 'Erro!', {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-right",
            preventDuplicates: true,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        });
    }
    else{
        const titulo = document.querySelector('#taxasModal .modal-title');
        titulo.textContent = `Alterar Taxas - ${loja}`;

        const modal = document.getElementById('taxasModal');
        modal.classList.add('show');

        $.ajax({
            url: '/carregar_taxas',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ loja: loja }),
            success: function(response) {
                $('#saida1Input').val(response.saida1);
                $('#saida2Input').val(response.saida2);
                $('#atendimentoMedioInput').val(response.atendimento);
            },
            error: function(xhr, status, error) {
                toastr.error("Erro ao carregar as taxas:", error);
            }
        });

    }
}

function fecharModalTaxas(){
    const modal = document.getElementById('taxasModal');
    modal.classList.remove('show');
}

function salvarTaxas(){
    const saida1 = $('#saida1Input').val();
    const saida2 = $('#saida2Input').val();
    const atendimento = $('#atendimentoMedioInput').val();

    $.ajax({
        url: '/salvar_taxas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            saida1: parseFloat(saida1),
            saida2: parseFloat(saida2),
            atendimento: parseFloat(atendimento)
        }),
        success: function(response) {
            toastr.success('Taxas salvas com sucesso!');
            fecharModalTaxas();
        },
        error: function(xhr, status, error) {
            toastr.error('Erro ao salvar as taxas.');
        }
    });
}

async function carregarAtendentes() {
    const tbody = document.getElementById('attendantsTableBody');
    tbody.innerHTML = '';

    try {
        const lojaSelecionada = document.querySelector('[data-select="loja"] .selected-text').textContent.trim();
        
        const titulo = document.querySelector('#historicoModal .modal-title');

        titulo.textContent = `Histórico de Atendentes - Carregando atendentes...`;

        const response = await fetch('/nome_historico_funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loja: lojaSelecionada })
        });


        if (!response.ok) {
            const error = await response.json();
            alert("Erro ao carregar atendentes: " + (error.erro || response.status));
            return;
        }
        
        const atendentes = await response.json();

        titulo.textContent = `Histórico de Atendentes - ${lojaSelecionada}`;

        tbody.innerHTML = '';
        atendentes.forEach((atendente, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${atendente.nome}</td>
            <td>
                <input type="number" 
                        class="days-input" 
                        value="${atendente.diasSeguidos}"
                        min="0" 
                        max="6"
                        data-attendant="${index}">
            </td>
            <td>
                <div class="sunday-checkboxes">
                    <div class="sunday-checkbox">
                        <input type="checkbox" 
                                id="ultimo_${index}" 
                                data-attendant="${index}" 
                                data-type="ultimo"
                                ${atendente.ultimoDomingo ? 'checked' : ''}>
                        <label for="ultimo_${index}">Último Domingo</label>
                    </div>
                    <div class="sunday-checkbox">
                        <input type="checkbox" 
                                id="penultimo_${index}" 
                                data-attendant="${index}" 
                                data-type="penultimo"
                                ${atendente.penultimoDomingo ? 'checked' : ''}>
                        <label for="penultimo_${index}">Penúltimo Domingo</label>
                    </div>
                </div>
            </td>
            `;
        tbody.appendChild(row);
        });
    } catch (err) {
        alert("Erro inesperado ao carregar atendentes.");
    }
}


async function salvarHistorico() {
    const dadosHistorico = [];
    const tbody = document.getElementById('attendantsTableBody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach((row, index) => {
        const nome = row.querySelector('td').textContent;
        const diasSeguidos = row.querySelector('.days-input').value;
        const ultimoDomingo = row.querySelector(`#ultimo_${index}`).checked;
        const penultimoDomingo = row.querySelector(`#penultimo_${index}`).checked;

        dadosHistorico.push({
            nome,
            diasSeguidos: parseInt(diasSeguidos),
            ultimoDomingo,
            penultimoDomingo
        });
    });

    $.ajax({
        url: '/salvar_historico_funcionarios',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            dadosHistorico: dadosHistorico
        }),
        success: function (response) {

            toastr.success(response.message, 'Sucesso!', {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-right",
                preventDuplicates: true,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            });
            fecharModal();
        },
        error: function (xhr, status, error) {
            toastr.error(xhr.responseJSON.message, 'Erro!', {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-right",
                preventDuplicates: true,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            });
        }
    });
}
   

function mostrarLoading() {
    const modal = document.getElementById('loadingModal');
    const loadingText = document.getElementById('loadingText');
    
    modal.classList.add('show');

    loadingText.textContent = 'Carregando fluxo...';
    
    setTimeout(() => {
        loadingText.textContent = 'Otimizando grade...';
    }, 500);
}

function esconderLoading() {
    const modal = document.getElementById('loadingModal');
    modal.classList.remove('show');
}

function demonstrarLoading() {
    mostrarLoading();

    setTimeout(() => {
        esconderLoading();
    }, 500);
}

function gerarGrade() {
    const loja = document.querySelector('[data-select="loja"] .selected-text').textContent;
    const ano = document.querySelector('[data-select="ano"] .selected-text').textContent;
    const mes = document.querySelector('[data-select="mes"] .selected-text').textContent;
    let porcentagem = document.getElementById('porcentagemInput').value;

    if (porcentagem === '' || isNaN(porcentagem)){
        porcentagem = 0;
    }
    
    mostrarLoading();

    $.ajax({
        url: '/gerar',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            loja: loja,
            ano: ano,
            mes: mes,
            porcentagem: porcentagem
        }),
        success: function (response) {
            esconderLoading();
            toastr.success(response.message, 'Sucesso!', {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-right",
                preventDuplicates: true,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            });

            window.location.href = "/grade";
        },
        error: function (xhr, status, error) {
            esconderLoading();
            toastr.error(xhr.responseJSON.message, 'Erro!', {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-right",
                preventDuplicates: true,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            });
        }
    });
}

