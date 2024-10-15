<?php
session_start(); // Inicia a sessão do usuário

$file = 'online.txt'; // Define o arquivo que armazenará os usuários online
$timeout_duration = 300; // Tempo de inatividade em segundos (5 minutos)

// Atualiza o tempo da última atividade do usuário na sessão
$_SESSION['last_activity'] = time();

// Verifica se o arquivo existe, caso não exista, cria-o
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

// Lê os dados de usuários online do arquivo
$online_users = json_decode(file_get_contents($file), true);

// Atualiza o timestamp do usuário atual (sessão)
$online_users[session_id()] = time();

// Remove usuários que estiveram inativos por mais tempo que o limite (5 minutos)
foreach ($online_users as $session_id => $timestamp) {
    if (time() - $timestamp > $timeout_duration) {
        unset($online_users[$session_id]);
    }
}

// Atualiza o arquivo com a lista de usuários online
file_put_contents($file, json_encode($online_users));

// Retorna o número de usuários online
echo count($online_users);
?>
