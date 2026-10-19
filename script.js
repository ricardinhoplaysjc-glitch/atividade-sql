
const entrada = document.getElementById('arquivo');
const botao = document.getElementById('btnAbrir');
const conteudoSQL = document.getElementById('conteudoSQL');
const saida = document.getElementById('saida');

botao.addEventListener('click', async () => {
    saida.innerHTML = '';
    conteudoSQL.textContent = '(nenhum arquivo carregado)';

    if (entrada.files.length === 0) {
        saida.innerHTML = '<p class="erro">Selecione um arquivo .sql primeiro.</p>';
        return;
    }

    // 1. Lê o arquivo escolhido pelo usuário
    const conteudo = await entrada.files[0].text();
    conteudoSQL.textContent = conteudo;

    try {
        // 2. Cria um banco SQLite na memória do navegador
        const SQL = await initSqlJs({
            locateFile: arquivo =>
                'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + arquivo
        });

        const banco = new SQL.Database();

        // 3. Executa todos os comandos do arquivo (CREATE, INSERT...)
        banco.exec(conteudo);

        // 4. Descobre o nome da primeira tabela criada
        const tabelas = banco.exec(
            "SELECT name FROM sqlite_master WHERE type='table'"
        );

        if (tabelas.length === 0) {
            saida.innerHTML = '<p class="erro">O arquivo não criou nenhuma tabela.</p>';
            return;
        }

        const nomeTabela = tabelas[0].values[0][0];

        // 5. Consulta os dados e monta a tabela HTML
        const dados = banco.exec('SELECT * FROM "' + nomeTabela.replace(/"/g, '""') + '"');

        if (dados.length === 0) {
            saida.innerHTML = '<p>A tabela está vazia.</p>';
            return;
        }

        let html = '<table><tr>';

        for (const coluna of dados[0].columns) {
            html += '<th>' + coluna + '</th>';
        }

        html += '</tr>';

        for (const linha of dados[0].values) {
            html += '<tr>';

            for (const valor of linha) {
                html += '<td>' + (valor ?? '') + '</td>';
            }

            html += '</tr>';
        }

        html += '</table>';
        saida.innerHTML = html;

    } catch (erro) {
        saida.innerHTML =
            '<p class="erro">Erro ao executar o SQL: ' +
            erro.message +
            '</p>';
    }
});
