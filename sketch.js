/*
let dataset; // Para armazenar o dataset carregado
        let continentsData = {}; // Para armazenar dados agregados por continente
        let maxVolume; // Para normalizar os valores no gráfico

  function preload() {
    data = loadTable("assets/Rivers_in_the_world-Data.csv", "csv", "header");
  }
  let rectColor = "marineblue";
  let padding = 20;
  let xRet = 0; // Posição X do centro do retângulo
  let yRet = 0; // Posição Y do centro do retângulo
  let largRet = 100; // Largura do retângulo
  let altRet = 100; // Altura do retângulo
  let rectSize "(xRet, yRet, largRet, altRet)";


  function setup() {
    let totalWidth =
      rectSize * data.getRowCount() + padding * (1 + data.getRowCount());
    createCanvas(totalWidth, windowHeight);
    background(pageColor);


    filteredData = dataset.map(item => ({
      continent: item.continent,
      volume: item.volume
    }));

    console.log(filteredData); // Ver os dados filtrados no console


    dataObj = data.getObject();

    let xPos = padding + rectSize / 2;
    let yPos = windowHeight / 2;

    for (let i = 0; i < data.getRowCount(); i++) {
      let item = dataObj[i];
  
      console.log(item);
  
      drawGlyph(xPos, yPos, rectSize, item);
      xPos = xPos + padding + rectSize;
    }

  }

  function draw() {
      background(240);
      drawBarChart();
  }

  function aggregateData() {
      // Agregar os volumes de água por continente
      dataset.forEach(data => {
          if (continentsData[data.continent]) {
              continentsData[data.continent] += data.volume;
          } else {
              continentsData[data.continent] = data.volume;
          }
      });
  }

  function drawBarChart() {
    let barWidth = width / filteredData.length - 20; // Largura das barras
    let maxVolume = max(filteredData.map(d => d.volume)); // Encontrar o volume máximo

    textAlign(CENTER);
    textSize(14);

    for (let i = 0; i < filteredData.length; i++) {
        let continent = filteredData[i].continent;
        let volume = filteredData[i].volume;

        // Altura da barra normalizada
        let barHeight = map(volume, 0, maxVolume, 0, height - 100);

        // Desenhar a barra
        fill(100, 150, 250);
        rect(i * (barWidth + 20) + 40, height - barHeight - 50, barWidth, barHeight);

        // Desenhar o nome do continente
        fill(0);
        text(continent, i * (barWidth + 20) + 40 + barWidth / 2, height - 20);

        // Exibir o valor do volume
        text(volume + " m³/s", i * (barWidth + 20) + 40 + barWidth / 2, height - barHeight - 60);
    }
}*/



let dataset; // Para armazenar o dataset carregado
let continentData = {}; // Dados agregados por continente
let maxDischarge, maxLength, maxArea; // Para normalizar os valores no gráfico
let padding = 40; // Espaçamento entre grupos de colunas
let barWidth = 30; // Largura de cada barra individual
let barSpacing = 10; // Espaçamento entre as barras dentro de um grupo
let groupWidth; // Largura de um grupo de barras (discharge, length, area)

function preload() {
  // Carregar o dataset do CSV
  dataset = loadTable("assets/Rivers_in_the_world-Data.csv", "csv", "header");
}

function setup() {
  // Criar o canvas com largura igual à largura da janela
  createCanvas(windowWidth, windowHeight);

  background(50); // Fundo cinza escuro

  // Processar os dados do dataset
  processData();

  // Encontrar os valores máximos para normalização
  maxDischarge = max(Object.values(continentData).map(d => d.totalDischarge));
  maxLength = max(Object.values(continentData).map(d => d.totalLength));
  maxArea = max(Object.values(continentData).map(d => d.totalArea));

  // Largura de cada grupo de barras (discharge, length, area)
  groupWidth = 3 * barWidth + 2 * barSpacing;

  // Exibir os dados processados no console (opcional)
  console.log(continentData);

  // Desenhar o gráfico
  drawBarChart();
}

function processData() {
  // Inicializar os dados agregados por continente
  dataset.rows.forEach(row => {
    let continent = row.get("continent");
    let discharge = parseFloat(row.get("discharge"));
    let length = parseFloat(row.get("length"));
    let area = parseFloat(row.get("area"));

    if (!continentData[continent]) {
      continentData[continent] = {
        totalDischarge: 0,
        totalLength: 0,
        totalArea: 0
      };
    }

    // Somar os valores para cada métrica
    continentData[continent].totalDischarge += discharge;
    continentData[continent].totalLength += length;
    continentData[continent].totalArea += area;
  });
}

function drawBarChart() {
  // Calcular a largura total ocupada pelas barras e os espaçamentos
  let totalWidth = Object.keys(continentData).length * (groupWidth + padding);

  // Calcular o deslocamento inicial para centralizar
  let xPos = (width - totalWidth) / 2;

  textAlign(CENTER);
  textSize(14);
  stroke(255); // Definir a cor da borda para branco
  strokeWeight(1); // Espessura da borda do texto

  // Para cada continente, desenhar as barras para cada métrica
  for (const [continent, data] of Object.entries(continentData)) {
    // Alturas normalizadas das barras
    let barHeightDischarge = map(data.totalDischarge, 0, maxDischarge, 0, height - 150);
    let barHeightLength = map(data.totalLength, 0, maxLength, 0, height - 150);
    let barHeightArea = map(data.totalArea, 0, maxArea, 0, height - 150);

    // Cor para a barra de discharge (do mais claro para o mais escuro)
    let colorDischargeLight = color(100, 200, 255); // cor clara
    let colorDischargeDark = color(0, 100, 255);   // cor escura
    // Desenhar a barra de discharge com gradiente
    drawGradientBar(xPos, height - 50 - barHeightDischarge, barWidth, barHeightDischarge, colorDischargeLight, colorDischargeDark);
    fill(0);
    push(); // Iniciar o bloco para transformar o texto
    translate(xPos + barWidth / 2, height - 55 - barHeightDischarge); // Posição do texto
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    text(data.totalDischarge.toFixed(2), 0, 0); // Texto na vertical
    pop(); // Restaurar o estado original

    // Cor para a barra de length (do mais claro para o mais escuro)
    let colorLengthLight = color(150, 255, 100); // cor clara
    let colorLengthDark = color(50, 200, 50);    // cor escura
    // Desenhar a barra de length com gradiente
    drawGradientBar(xPos + barWidth + barSpacing, height - 50 - barHeightLength, barWidth, barHeightLength, colorLengthLight, colorLengthDark);
    fill(0);
    push(); // Iniciar o bloco para transformar o texto
    translate(xPos + barWidth + barSpacing + barWidth / 2, height - 55 - barHeightLength); // Posição do texto
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    text(data.totalLength.toFixed(2), 0, 0); // Texto na vertical
    pop(); // Restaurar o estado original

    // Cor para a barra de area (do mais claro para o mais escuro)
    let colorAreaLight = color(255, 200, 100); // cor clara
    let colorAreaDark = color(255, 100, 0);    // cor escura
    // Desenhar a barra de area com gradiente
    drawGradientBar(xPos + 2 * (barWidth + barSpacing), height - 50 - barHeightArea, barWidth, barHeightArea, colorAreaLight, colorAreaDark);
    fill(0);
    push(); // Iniciar o bloco para transformar o texto
    translate(xPos + 2 * (barWidth + barSpacing) + barWidth / 2, height - 55 - barHeightArea); // Posição do texto
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    text(data.totalArea.toFixed(2), 0, 0); // Texto na vertical
    pop(); // Restaurar o estado original

    // Desenhar o nome do continente abaixo do grupo de barras
    textSize(14);
    text(continent, xPos + groupWidth / 2, height - 20);

    // Atualizar a posição horizontal para o próximo continente
    xPos += groupWidth + padding;
  }

  // Desenhar a legenda
  drawLegend();
}

function drawLegend() {
  textSize(12);
  textAlign(LEFT);

  // Legenda das cores
  fill(100, 200, 255);
  rect(20, 20, 20, 20);
  fill(0);
  text("Discharge", 50, 35);

  fill(150, 255, 100);
  rect(20, 50, 20, 20);
  fill(0);
  text("Length", 50, 65);

  fill(255, 200, 100);
  rect(20, 80, 20, 20);
  fill(0);
  text("Area", 50, 95);
}

function drawGradientBar(x, y, w, h, c1, c2) {
  // Função para desenhar uma barra com gradiente vertical
  for (let i = 0; i < h; i++) {
    let inter = map(i, 0, h, 0, 1); // Interpolar de 0 a 1 ao longo da altura da barra
    let c = lerpColor(c1, c2, inter); // Interpolação da cor
    stroke(c);
    line(x, y + i, x + w, y + i); // Desenha a linha (parte da barra)
  }
}

function windowResized() {
  // Recalcular o tamanho do canvas quando a janela for redimensionada
  resizeCanvas(windowWidth, windowHeight);
  background(50); // Redefinir o fundo cinza escuro
  drawBarChart();
}
