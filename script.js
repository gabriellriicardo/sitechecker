// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SUA_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicialize o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências do banco de dados
const visitorsRef = database.ref("visitors");
const onlineUsersRef = database.ref("onlineUsers");

// Atualizar o número total de visitantes
visitorsRef.once('value', (snapshot) => {
    document.getElementById("totalVisitors").textContent = snapshot.val() || 0;
});

// Atualizar o número de pessoas online
onlineUsersRef.on('value', (snapshot) => {
    document.getElementById("onlineUsers").textContent = snapshot.numChildren();
});

// Adicionar um visitante
function addVisitor() {
    const visitorRef = onlineUsersRef.push();
    visitorRef.set(true);

    // Remover o visitante quando ele sair do site
    window.addEventListener("beforeunload", () => {
        visitorRef.remove();
    });

    // Incrementar o total de visitantes
    visitorsRef.transaction(currentValue => (currentValue || 0) + 1);
}

// Chamando a função para adicionar o visitante ao carregar a página
addVisitor();

// Restante do código que você já possui...
document.getElementById("checkButton").addEventListener("click", function() {
    const siteInput = document.getElementById("siteInput").value;
    const resultDiv = document.getElementById("result");
    const statusDiv = document.getElementById("status");
    const faviconImg = document.getElementById("favicon");
    const ipText = document.getElementById("ip");
    const screenshotImg = document.getElementById("screenshot");
    const descriptionText = document.getElementById("description");

    // Resetar os resultados
    statusDiv.innerHTML = '';
    faviconImg.src = '';
    ipText.innerHTML = '';
    screenshotImg.src = '';
    descriptionText.innerHTML = '';
    resultDiv.style.display = 'none';

    if (!siteInput) {
        alert('Por favor, insira um URL.');
        return;
    }

    // Verifica o status do site
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(siteInput)}`)
        .then(response => {
            if (response.ok) {
                statusDiv.innerHTML = '<span style="color: green;">● Site está online</span>';
                return response.json();
            } else {
                statusDiv.innerHTML = '<span style="color: red;">● Site está offline</span>';
            }
        })
        .then(data => {
            if (data && data.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');

                // Obtendo o favicon
                let faviconUrl = '';
                const faviconLinks = doc.querySelectorAll("link[rel*='icon']");

                if (faviconLinks.length > 0) {
                    faviconUrl = faviconLinks[0].href;
                } else {
                    faviconUrl = `${siteInput}/favicon.ico`;
                }

                faviconImg.src = faviconUrl;

                // Obtendo o IP do site
                fetch(`https://api.ipify.org?format=json`)
                    .then(response => response.json())
                    .then(ipData => {
                        ipText.innerHTML = `IP do site: ${ipData.ip}`;
                    });

                // Obtendo o screenshot do site
                fetch(`https://api.screenshotmachine.com?key=8639cf&url=${encodeURIComponent(siteInput)}&dimension=1024x768`)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        screenshotImg.src = url;
                    });

                // Descrição do site (meta description)
                const description = doc.querySelector("meta[name='description']");
                descriptionText.innerHTML = description ? description.content : 'Descrição não encontrada';

                resultDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            statusDiv.innerHTML = '<span style="color: red;">● Não foi possível verificar o site</span>';
            resultDiv.style.display = 'block';
        });
});
