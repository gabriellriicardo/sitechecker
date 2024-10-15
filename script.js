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
                    // Se encontrar links para ícones, pega o primeiro que encontrar
                    faviconUrl = faviconLinks[0].href;
                } else {
                    // Tenta buscar o favicon padrão se não encontrar um específico
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
