# Postelo

Um aplicativo de câmera com efeito de carimbo (perforações) desenvolvido com Next.js e TypeScript.

## Funcionalidades

- Captura de fotos com câmera traseira
- Efeito de carimbo com perfurações nas bordas
- Visualização de preview com efeito aplicado
- Galeria de fotos capturadas
- PWA (Progressive Web App) para instalação e uso offline

## Tecnologias

- Next.js 16+
- React
- TypeScript
- Canvas API para processamento de imagem
- Service Workers para funcionalidades PWA
- Tailwind CSS para estilização

## Estrutura do Projeto

```
/postelo
  /app                    # Rotas do Next.js App Router
    /camera               # Página de captura da câmera
    /preview              # Página de pré-visualização
    /gallery              # Página da galeria
  /components             # Componentes reutilizáveis
    /StampOverlay.tsx     # Componente de overlay do carimbo
  /lib                    # Funções utilitárias
    /stampGeometry.ts     # Funções de geometria do carimbo
  /public                 # Arquivos estáticos
    /manifest.json        # Configuração PWA
    /sw.js                # Service Worker
```

## Instalação

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Execute `npm run dev` para iniciar o servidor de desenvolvimento
4. Acesse `http://localhost:3000` no seu navegador

## Uso

1. Na página da câmera, permita o acesso à câmera
2. Posicione o carimbo sobre o objeto que deseja fotografar
3. Clique no botão circular para capturar a foto
4. Na página de preview, visualize a foto com o efeito de carimbo aplicado
5. Confirme para salvar na galeria ou tire novamente
6. Acesse a galeria para ver todas as fotos capturadas

## Efeito de Carimbo

O efeito de carimbo é criado usando:

1. **Geometria de Perfurações**: Algoritmo que percorre as bordas do carimbo e insere arcos (semicírculos) com sweep=1, fazendo com que os semicírculos "mordam" para dentro do carimbo.

2. **Clip Path**: Ao processar a imagem capturada, o caminho do carimbo é usado como região de corte (clip region) no canvas, resultando na imagem com o formato do carimbo.

## PWA Features

- Instalável como aplicativo nativo
- Funciona offline (conteúdo já carregado)
- Acesso à câmera do dispositivo
- Experiência fullscreen

## Acesso à Câmera em Dispositivos Móveis

Durante o desenvolvimento, o acesso à câmera funciona tanto em HTTP quanto em HTTPS. Para testar em dispositivos móveis:

1. **Ambiente de Desenvolvimento Local**: O acesso à câmera funciona em localhost tanto em HTTP quanto em HTTPS.

2. **Dispositivos Móveis Reais**: Durante o desenvolvimento, você pode acessar o servidor diretamente do dispositivo móvel via IP local (ex: http://192.168.1.100:3000).

3. **Produção**: Em ambientes de produção, o acesso à câmera exigirá HTTPS por questões de segurança dos navegadores.

4. **Alternativa de Upload**: Se o acesso à câmera não for possível por qualquer motivo, a aplicação oferece uma alternativa de upload de arquivo para testar o efeito de carimbo.

## Limitações

- Em produção, é necessário HTTPS para acesso à câmera (política de segurança dos navegadores)
- A funcionalidade de câmera só funciona em navegadores modernos que suportam as APIs utilizadas
- Alguns navegadores podem solicitar permissão explícita para acessar a câmera