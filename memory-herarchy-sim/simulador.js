// Definição inicial dos níveis de memória (ATUALIZADA: Apenas L1 e Memória Principal)
let niveisMemoria = [
    // Cache L1 (Cache principal)
    { nome: "Cache L1", tamanho: 4, tempoAcesso: 1, custoPorAcesso: 0.5, dados: new Map(), hits: 0, misses: 0 },
    // Memória Principal (RAM) - Nível mais lento. Não calculamos Hit/Miss.
    { nome: "Memória Principal (RAM)", tamanho: 32, tempoAcesso: 50, custoPorAcesso: 50.0, dados: new Map(), hits: 0, misses: 0 } 
];

// --- Funções de Interface (para configurar os níveis) ---

function renderizarNiveis() {
    const configDiv = document.getElementById('configNiveis');
    if (!configDiv) return;
    configDiv.innerHTML = '';

    niveisMemoria.forEach((nivel, index) => {
        configDiv.innerHTML += `
            <div class="nivel">
                <h4>Nível ${index + 1}: ${nivel.nome}</h4>
                <label>Nome: <input type="text" value="${nivel.nome}" onchange="niveisMemoria[${index}].nome = this.value"></label><br>
                <label>Tamanho (blocos): <input type="number" min="1" value="${nivel.tamanho}" onchange="niveisMemoria[${index}].tamanho = parseInt(this.value); niveisMemoria[${index}].dados.clear()"></label><br>
                <label>Tempo de Acesso (ms): <input type="number" step="0.1" min="0.1" value="${nivel.tempoAcesso}" onchange="niveisMemoria[${index}].tempoAcesso = parseFloat(this.value)"></label><br>
                <label>Energia por Acesso (nJ): <input type="number" step="0.01" value="${nivel.custoPorAcesso}" onchange="niveisMemoria[${index}].custoPorAcesso = parseFloat(this.value)"></label>
            </div>
        `;
    });
}

function adicionarNivel() {
    const novoIndex = niveisMemoria.length; // Insere o novo nível ANTES da RAM
    
    // Remove a RAM temporariamente
    const ram = niveisMemoria.pop();

    niveisMemoria.push({
        nome: `Cache L${novoIndex}`, // Assume que é um novo cache
        tamanho: 16 * novoIndex,
        tempoAcesso: 10 * (novoIndex - 1) + 5, 
        custoPorAcesso: 5.0 * novoIndex, 
        dados: new Map(),
        hits: 0,
        misses: 0
    });
    
    // Adiciona a RAM de volta como o último nível
    niveisMemoria.push(ram);
    renderizarNiveis();
}

document.addEventListener('DOMContentLoaded', renderizarNiveis);

// --- Funções Auxiliares para Localidade Espacial (Blocos) ---

function calcularBloco(endereco) {
    const lineSize = parseInt(document.getElementById('lineSize')?.value) || 1; 
    const blocoID = Math.floor(endereco / lineSize);
    const deslocamento = endereco % lineSize;
    return { blocoID, deslocamento };
}

function ajustarTamanhos() {
    niveisMemoria.forEach(nivel => {
        nivel.dados.clear();
    });
    const logAcessosDiv = document.getElementById('logAcessos');
    if (logAcessosDiv) {
        logAcessosDiv.innerHTML = "<p style='color: blue;'>Configuração do Bloco/Linha alterada. Gere uma nova sequência de acessos e simule.</p>";
    }
}


// --- Funções para Geração de Padrões de Acesso ---

function gerarAcessos(tipo) {
    const numAcessosInput = document.getElementById('numAcessos');
    const maxEnderecoInput = document.getElementById('numAcessos');
    
    const numAcessos = parseInt(numAcessosInput.value);
    let maxEndereco = parseInt(maxEnderecoInput.value);

    if (isNaN(numAcessos) || numAcessos < 1) {
        alert("Por favor, insira um número válido de acessos.");
        return;
    }
    
    let sequencia = [];
    
    switch (tipo) {
        case 'sequencial':
            if (isNaN(maxEndereco) || maxEndereco < 1) {
                alert("Por favor, insira um endereço máximo válido para o padrão sequencial.");
                return;
            }
            sequencia = gerarSequencial(numAcessos, maxEndereco);
            break;
            
        case 'temporal':
            maxEndereco = Math.max(maxEndereco, numAcessos);
            maxEnderecoInput.value = maxEndereco; 
            sequencia = gerarTemporal(numAcessos, maxEndereco);
            break;
            
        case 'aleatorio':
            maxEndereco = numAcessos; 
            maxEnderecoInput.value = maxEndereco; 
            sequencia = gerarAleatorio(numAcessos, maxEndereco);
            break;
            
        default:
            return;
    }

    document.getElementById('acessos').value = sequencia.join(',');
}

function gerarSequencial(numAcessos, maxEndereco) {
    const sequencia = [];
    for (let i = 0; i < numAcessos; i++) {
        const endereco = (i % maxEndereco); 
        sequencia.push(endereco);
    }
    return sequencia;
}

function gerarTemporal(numAcessos, maxEndereco) {
    const sequencia = [];
    
    const workingSetSize = Math.max(4, 8); 
    const baseOffset = Math.floor(maxEndereco / 4) || 1; 
    const changeFrequency = Math.min(20, Math.max(5, Math.floor(numAcessos / 10))); 

    let focusAddress = 1; 
    let currentBase = 0; 
    
    for (let i = 0; i < numAcessos; i++) {
        
        // 1. Acesso ao foco ou working set
        if (i % 3 === 0 || i % changeFrequency === 0) {
            sequencia.push(currentBase + focusAddress);
        } else {
            const offset = (i % (workingSetSize - 1)) + 2; 
            sequencia.push(currentBase + offset);
        }
        
        // 2. Mudança do endereço foco (contador)
        if (i > 0 && i % changeFrequency === 0) {
            focusAddress = (focusAddress % workingSetSize) + 1;
        }

        // 3. Mudança da BASE (espalhamento)
        if (i > 0 && i % (changeFrequency * 3) === 0) {
             currentBase = (currentBase + baseOffset) % maxEndereco;
        }
    }
    return sequencia;
}

function gerarAleatorio(numAcessos, maxEndereco) {
    const sequencia = [];
    for (let i = 0; i < numAcessos; i++) {
        const endereco = Math.floor(Math.random() * maxEndereco) + 1;
        sequencia.push(endereco);
    }
    return sequencia;
}


// --- Lógica Principal da Simulação ---

function acessarHierarquia(endereco) {
    let tempoAcumulado = 0;
    let custoAcumulado = 0;
    let resultado = 'MISS em todos';
    let hitNivelIndex = -1;

    const { blocoID } = calcularBloco(endereco); 

    for (let i = 0; i < niveisMemoria.length; i++) {
        const nivel = niveisMemoria[i];
        
        tempoAcumulado += nivel.tempoAcesso;
        custoAcumulado += nivel.custoPorAcesso;

        if (nivel.dados.has(blocoID)) {
            // HIT!
            nivel.hits++;
            resultado = `HIT no ${nivel.nome} (Bloco ${blocoID})`;
            hitNivelIndex = i;

            // LRU: Move o bloco para o final (mais recente)
            nivel.dados.delete(blocoID);
            nivel.dados.set(blocoID, Date.now()); 
            
            break;
        } else {
            // MISS
            nivel.misses++;
        }
    }

    // Promoção de Bloco
    if (hitNivelIndex >= 0 || (hitNivelIndex === -1 && niveisMemoria.length > 0)) {
        
        const limiteSuperior = hitNivelIndex === -1 ? niveisMemoria.length : hitNivelIndex;

        for (let i = 0; i < limiteSuperior; i++) {
            const nivelSuperior = niveisMemoria[i];
            
            // Se cache cheio, remove o LRU
            if (nivelSuperior.dados.size >= nivelSuperior.tamanho) {
                const lruKey = nivelSuperior.dados.keys().next().value;
                nivelSuperior.dados.delete(lruKey);
            }
            
            // Promove o bloco
            nivelSuperior.dados.set(blocoID, Date.now()); 
        }

        if (hitNivelIndex === -1) {
             // O hitNivelIndex é -1, o dado veio da RAM (último nível)
             resultado = `MISS total, Bloco ${blocoID} carregado no L1`;
        }
    }

    return { tempo: tempoAcumulado, custo: custoAcumulado, resultado: resultado };
}


function simular() {
    let tempoTotal = 0;
    let custoTotal = 0;
    const logAcessosDiv = document.getElementById('logAcessos');
    if (!logAcessosDiv) return;
    logAcessosDiv.innerHTML = '';
    
    // Limpa caches e contadores
    niveisMemoria.forEach(nivel => {
        nivel.hits = 0;
        nivel.misses = 0;
        nivel.dados.clear();
    });

    const acessosStr = document.getElementById('acessos')?.value;
    if (!acessosStr) {
        alert("Nenhuma sequência de acessos inserida.");
        return;
    }
    
    const sequenciaAcessos = acessosStr
        .split(',')
        .map(a => parseInt(a.trim()))
        .filter(a => !isNaN(a) && a >= 0);

    if (sequenciaAcessos.length === 0) {
        alert("Nenhuma sequência de acessos válida encontrada.");
        return;
    }
    
    sequenciaAcessos.forEach((endereco) => {
        const resultadoAcesso = acessarHierarquia(endereco);
        tempoTotal += resultadoAcesso.tempo;
        custoTotal += resultadoAcesso.custo;

        const logItem = document.createElement('div');
        logItem.classList.add('acesso-item');
        logItem.classList.add(resultadoAcesso.resultado.includes('HIT') ? 'hit' : 'miss'); 
        logItem.innerHTML = `**Acesso ${endereco}**: ${resultadoAcesso.resultado} | Tempo: ${resultadoAcesso.tempo.toFixed(1)}ms`;
        logAcessosDiv.appendChild(logItem);
    });

    // Exibe Resultados Globais
    document.getElementById('tempoTotal').textContent = `${tempoTotal.toFixed(1)} ms`;
    document.getElementById('custoTotal').textContent = `${custoTotal.toFixed(2)} nJ`;

    // Exibe estatísticas por nível (AJUSTADO: Ignora o último nível - RAM)
    const estatisticasDiv = document.createElement('div');
    estatisticasDiv.innerHTML = '<hr><h3>Estatísticas por Nível (Caches):</h3>';

    // Itera apenas pelos níveis de cache (todos exceto o último, que é a RAM)
    for (let i = 0; i < niveisMemoria.length - 1; i++) {
        const nivel = niveisMemoria[i];
        const totalAcessos = nivel.hits + nivel.misses;
        const taxaHit = totalAcessos > 0 ? (nivel.hits / totalAcessos * 100).toFixed(2) : 0;
        
        estatisticasDiv.innerHTML += `
            <p><strong>${nivel.nome}</strong>: 
            Hits: ${nivel.hits} | Misses: ${nivel.misses} | Total: ${totalAcessos} | **Taxa de Hit: ${taxaHit}%**</p>
        `;
    }
    logAcessosDiv.appendChild(estatisticasDiv);
}