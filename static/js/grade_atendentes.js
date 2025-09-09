function animarEntrada() {
    const elements = document.querySelectorAll('.section, .grade-info');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

document.addEventListener('DOMContentLoaded', animarEntrada);

function gerarExcel(){
    mostrarLoading();

    $.ajax({
        url: '/exportar_excel',
        type: 'POST',
        xhrFields: {
            responseType: 'blob'  // Importante para arquivos
        },
        success: function(data, status, xhr) {
            esconderLoading();

            // Criar URL do blob e fazer download
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            // Pegar o nome do arquivo do header (se disponível)
            const contentDisposition = xhr.getResponseHeader('Content-Disposition');
            let filename = 'escala.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showModal();
            console.log('Excel baixado com sucesso');
        },
        error: function(xhr, status, error) {
            esconderLoading();
            console.error('Erro:', error);
            alert('Erro ao baixar o arquivo Excel');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleScrollButton() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollPosition > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

function abrirModalSaldo() {
    const modal = document.getElementById('modalSaldo');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function fecharModalSaldo() {
    const modal = document.getElementById('modalSaldo');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora dele
document.getElementById('modalSaldo').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModalSaldo();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModalSaldo();
    }
});

window.addEventListener('scroll', toggleScrollButton);
window.addEventListener('load', toggleScrollButton);


function mostrarLoading() {
    const modal = document.getElementById('loadingModal');
    
    modal.classList.add('show');

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

function showModal() {
    document.getElementById('exportedConfirm').classList.add('show');
}

function closeModal() {
    document.getElementById('exportedConfirm').classList.remove('show');
}

document.getElementById('exportedConfirm').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
        
    }
});