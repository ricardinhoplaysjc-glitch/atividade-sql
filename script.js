

const entrada = document.getElementById('arquivo');
const botao = document.getElementById('btnAbrir');
const conteudoSQL = document.getElementById('conteudoSQL');
const saida = document.getElementById('saida');

botao.addEventListener('click', async () => {
    saida.innerHTML = '';
    conteudoSQL.textContent = '(nenhum arquivo carregado)';

    if (entrada.files.length === 0) {
        saida.textContent = 'Selecione um arquivo .sql primeiro.';
        saida.className = 'erro';
        return;
    }

    // 1. Lê o arquivo SQL
    const conteudo = await entrada.files[0].text();
    conteudoSQL.textContent = conteudo;

    try {
        // 2. Inicializa o SQLite no navegador
        const SQL = await initSqlJs({
            locateFile: arquivo =>
                'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + arquivo
        });

        const banco = new SQL.Database();

        // 3. Separa os comandos SQL
        const comandos = conteudo
            .split(';')
            .map(comando => comando.trim())
            .filter(comando => comando.length > 0);

        let resultados = [];

        // 4. Executa cada comando individualmente
        for (const comando of comandos) {
            const resultado = banco.exec(comando);

            // Guarda somente os resultados dos comandos SELECT
            if (/^\s*SELECT\b/i.test(comando)) {
                resultados.push(...resultado);
            }
        }

        // 5. Verifica se houve alguma consulta SELECT
        if (resultados.length === 0) {
            saida.textContent =
                'Nenhum resultado encontrado. Verifique se o arquivo contém um SELECT.';
            return;
        }

        // 6. Monta a tabela com as colunas selecionadas
        let html = '';

        for (const dados of resultados) {
            html += '<table><thead><tr>';

            for (const coluna of dados.columns) {
                html += '<th>' + escaparHTML(coluna) + '</th>';
            }

            html += '</tr></thead><tbody>';

            for (const linha of dados.values) {
                html += '<tr>';

                for (const valor of linha) {
                    html += '<td>' + escaparHTML(valor ?? '') + '</td>';
                }

                html += '</tr>';
            }

            html += '</tbody></table>';
        }

        saida.innerHTML = html;

    } catch (erro) {
        saida.textContent = 'Erro ao executar o SQL: ' + erro.message;
        saida.className = 'erro';
    }
});

// 7. Evita interpretar os dados do banco como HTML
function escaparHTML(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

