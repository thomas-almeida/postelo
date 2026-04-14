# Instruções para Testar em Dispositivos Móveis

## Acesso à Câmera em Dispositivos Móveis

Devido às políticas de segurança dos navegadores, o acesso à câmera em dispositivos móveis reais requer um ambiente seguro (HTTPS). Esta é uma limitação de segurança padrão dos navegadores e não um problema com o aplicativo.

## Soluções para Testar em Dispositivos Móveis

### 1. Ambiente de Desenvolvimento Local (localhost)
- O localhost é considerado um ambiente seguro, então o acesso à câmera deve funcionar em dispositivos conectados à mesma rede local
- Certifique-se de que o servidor está rodando e o dispositivo móvel está na mesma rede WiFi
- Acesse o IP local do computador hospedeiro (ex: http://192.168.1.100:3000) no navegador do dispositivo móvel

### 2. Ferramentas para Tornar Localhost Acessível via HTTPS
Use uma ferramenta como o ngrok para expor seu localhost via HTTPS:

```bash
# Instale o ngrok
npm install -g ngrok

# Após iniciar o servidor com npm run dev
ngrok http 3000
```

### 3. Hospedagem em Plataforma com HTTPS
- Faça deploy da aplicação em uma plataforma que forneça HTTPS, como Vercel, Netlify ou similar
- Exemplos: 
  - Vercel: `vercel` após instalar o CLI
  - Netlify: `netlify deploy` após instalar o CLI

### 4. Alternativa de Upload de Arquivo
Se o acesso à câmera não for possível, a aplicação oferece uma alternativa de upload de arquivo:
- Na tela da câmera, se o acesso for negado ou não suportado, aparecerá a opção para escolher uma foto
- O efeito de carimbo será aplicado à imagem selecionada
- Funciona como alternativa válida para testar a funcionalidade principal

## Solução de Problemas Comuns

### "Acesso à câmera não suportado neste navegador"
- Verifique se o navegador suporta as APIs necessárias (Chrome, Firefox, Safari recentes)
- Certifique-se de que está em um ambiente seguro (HTTPS ou localhost)

### "Permissão para acessar a câmera negada"
- Verifique as configurações de permissão do navegador
- Feche e reabra o navegador
- Tente novamente e aceite a permissão quando solicitado

### "Ambiente não é seguro"
- Use localhost para desenvolvimento local
- Use HTTPS para produção
- Verifique se não há mixed content (conteúdo HTTP em página HTTPS)

## Testando a Funcionalidade de Carimbo
Mesmo sem acesso à câmera, você pode testar completamente a funcionalidade de carimbo com o upload de arquivo:
1. Acesse a tela da câmera
2. Quando solicitado a escolher uma foto, selecione uma imagem
3. O efeito de carimbo será aplicado automaticamente
4. Prossiga para a tela de preview e galeria

## Considerações Adicionais
- Em alguns dispositivos Android, o navegador padrão pode ter restrições adicionais
- Recomenda-se testar com Chrome ou Firefox em dispositivos Android
- Em iOS, Safari é o navegador recomendado