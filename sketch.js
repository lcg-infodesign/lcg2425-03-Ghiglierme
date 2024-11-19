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
let continentData = {}; // Dados agregados por continente e tributários
let maxDischarge; // Para normalizar os valores no gráfico
let padding = 20; // Espaçamento entre colunas
let barWidth = 100; // Largura de cada coluna (continente)

function preload() {
  // Carregar o dataset do CSV
  dataset = loadTable("assets/Rivers_in_the_world-Data.csv", "csv", "header");
}

function setup() {
  // Criar o canvas com largura igual à largura da janela
  createCanvas(windowWidth, windowHeight);

  background(240);

  // Processar os dados do dataset
  processData();

  // Encontrar o valor máximo de discharge para normalização
  maxDischarge = max(Object.values(continentData).map(d => d.totalDischarge));

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

    if (!continentData[continent]) {
      continentData[continent] = {
        totalDischarge: 0
      };
    }

    // Somar o discharge total do continente
    continentData[continent].totalDischarge += discharge;
  });
}

function drawBarChart() {
  let xPos = padding; // Posição inicial da primeira coluna (continente)

  textAlign(CENTER);
  textSize(14);

  // Para cada continente, desenhar a coluna com a soma total de discharge
  for (const [continent, data] of Object.entries(continentData)) {
    let totalDischarge = data.totalDischarge;

    // Altura da barra normalizada
    let barHeight = map(totalDischarge, 0, maxDischarge, 0, height - 100);

    // Desenhar a barra
    fill(random(100, 255), random(100, 255), random(100, 255));
    rect(xPos, height - 50 - barHeight, barWidth, barHeight);

    // Exibir o valor total de discharge no topo da barra
    fill(0);
    textSize(12);
    text(totalDischarge.toFixed(2), xPos + barWidth / 2, height - 55 - barHeight);

    // Desenhar o nome do continente abaixo da coluna
    textSize(14);
    text(continent, xPos + barWidth / 2, height - 20);

    // Atualizar a posição horizontal para o próximo continente
    xPos += barWidth + padding;
  }
}

function windowResized() {
  // Recalcular o tamanho do canvas quando a janela for redimensionada
  resizeCanvas(windowWidth, windowHeight);
  background(240);
  drawBarChart();
}
