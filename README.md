<div align="center">

# Calculadora de Doses de Peptídeos

**Calculadora web responsiva para reconstituição, concentração e equivalência em seringas U-100.**

![HTML5](https://img.shields.io/badge/HTML5-web-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-responsive-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![Mobile](https://img.shields.io/badge/Mobile-first-f4b740)
![Version](https://img.shields.io/badge/version-1.0.0-6C63FF)
![Repository](https://img.shields.io/badge/repository-public-2EA44F)

[Abrir aplicação](https://calculadora.mirandastack.com/)

</div>

## Visão geral

A Calculadora de Doses de Peptídeos é uma aplicação web independente para cálculos de reconstituição, concentração e equivalência em seringas de insulina U-100.

A interface foi desenvolvida com prioridade para smartphone, mantendo boa experiência também em desktop.

## Principais recursos

- conteúdo do frasco em mg;
- volume de diluente em mL;
- seringas U-100 de 30, 50 e 100 UI;
- dose desejada em mg, mcg ou UI;
- cálculo em tempo real;
- concentração em mg/mL e mcg/mL;
- equivalência entre mg, mcg, mL e UI;
- escala visual numerada da seringa;
- indicação gráfica da posição da dose;
- alerta quando a dose ultrapassa a capacidade da seringa;
- cálculo aproximado de doses no frasco;
- compartilhamento pelo WhatsApp;
- cópia do resultado;
- histórico local com localStorage;
- suporte a vírgula e ponto decimal;
- interface responsiva e mobile-first.

## Como funciona

    Frasco em mg
         +
    Diluente em mL
         ↓
    Concentração mg/mL
         ↓
    Dose desejada
      mg / mcg / UI
         ↓
    Conversão para mL
         ↓
    Escala U-100 em UI

## Fórmulas principais

Concentração:

    mg/mL = conteúdo do frasco em mg / diluente em mL

Seringa U-100:

    1 UI = 0,01 mL
    mL = UI / 100
    UI = mL x 100

Conversão:

    1 mg = 1000 mcg

## Seringas suportadas

| Seringa | Capacidade |
|---|---:|
| 30 UI | 0,3 mL |
| 50 UI | 0,5 mL |
| 100 UI | 1,0 mL |

## Tecnologias

- HTML5
- CSS3
- JavaScript
- localStorage
- Nginx em produção

Não há framework, backend ou banco de dados.

## Execução local

    git clone https://github.com/EduMiranda78/calculadora-pepitideos.git
    cd calculadora-pepitideos
    python3 -m http.server 8080

Acesse:

    http://127.0.0.1:8080

## Produção

Aplicação pública:

[https://calculadora.mirandastack.com](https://calculadora.mirandastack.com/)

Na VPS, os arquivos são servidos diretamente pelo Nginx.

    /home/eduardo/calculadora

## Estrutura

    calculadora/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── README.md
    ├── CHANGELOG.md
    ├── CONTRIBUTING.md
    ├── SECURITY.md
    ├── VERSION
    └── .github/
        └── workflows/
            └── ci.yml

## Segurança e privacidade

A aplicação executa os cálculos localmente no navegador.

Não utiliza login, banco de dados ou API própria. O histórico permanece somente no localStorage do navegador.

Os resultados são matemáticos e informativos e não substituem orientação médica ou farmacêutica.

Consulte [SECURITY.md](SECURITY.md).

## Autor

Desenvolvido e mantido por **Eduardo Miranda**.

GitHub: [EduMiranda78](https://github.com/EduMiranda78)

Site: [Miranda Stack](https://mirandastack.com/)
