<?php
// Define o nome do arquivo onde será armazenado o número de visitas
$file = 'counter.txt';

// Verifica se o arquivo já existe, caso não exista, cria o arquivo com o valor 0
if (!file_exists($file)) {
    file_put_contents($file, 0);
}

// Lê o número de visitas atual no arquivo
$visits = file_get_contents($file);

// Incrementa o número de visitas
$visits++;

// Atualiza o arquivo com o novo número de visitas
file_put_contents($file, $visits);

// Retorna o número de visitas
echo $visits;
?>
