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



let dataset;
let continentData = {};
let maxDischarge, maxLength, maxArea;
let padding, barWidth, barSpacing, groupWidth;

function preload() {
  dataset = loadTable("assets/Rivers_in_the_world-Data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  processData();
  maxDischarge = max(Object.values(continentData).map(d => d.totalDischarge));
  maxLength = max(Object.values(continentData).map(d => d.totalLength));
  maxArea = max(Object.values(continentData).map(d => d.totalArea));

  drawBarChart();
  text("Quantità di acqua scaricata nell'oceano da ciascun continente rispetto alle dimensioni dei fiumi", 200, 50);
  fill('white')
}

function processData() {
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

    continentData[continent].totalDischarge += discharge;
    continentData[continent].totalLength += length;
    continentData[continent].totalArea += area;
  });
}

function drawBarChart() {
  background(50);

  calculateDimensions();

  let xPos = padding;

  textAlign(CENTER);
  textSize(constrain(width / 50, 12, 18));
  stroke(255);
  strokeWeight(1);

  for (const [continent, data] of Object.entries(continentData)) {
    let barHeightDischarge = map(data.totalDischarge, 0, maxDischarge, 0, height * 0.6);
    let barHeightLength = map(data.totalLength, 0, maxLength, 0, height * 0.6);
    let barHeightArea = map(data.totalArea, 0, maxArea, 0, height * 0.6);

    // Barra de discharge com gradiente
    let colorDischargeLight = color(100, 200, 255); // cor clara
    let colorDischargeDark = color(0, 100, 255);   // cor escura
    drawGradientBar(xPos, height - barHeightDischarge - 60, barWidth, barHeightDischarge, colorDischargeLight, colorDischargeDark);
    push();
    translate(xPos + barWidth / 2, height - barHeightDischarge - 100);
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    fill ('white')
    text(data.totalDischarge.toFixed(2), 0, 0);
    pop();

    // Barra de length com gradiente
    let colorLengthLight = color(150, 255, 100); // cor clara
    let colorLengthDark = color(50, 200, 50);    // cor escura
    drawGradientBar(xPos + barWidth + barSpacing, height - barHeightLength - 60, barWidth, barHeightLength, colorLengthLight, colorLengthDark);
    push();
    translate(xPos + barWidth + barSpacing + barWidth / 2, height - barHeightLength - 100);
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    fill ('white')
    text(data.totalLength.toFixed(2), 0, 0);
    pop();

    // Barra de area com gradiente
    let colorAreaLight = color(255, 200, 100); // cor clara
    let colorAreaDark = color(255, 100, 0);    // cor escura
    drawGradientBar(xPos + 2 * (barWidth + barSpacing), height - barHeightArea - 60, barWidth, barHeightArea, colorAreaLight, colorAreaDark);
    push();
    translate(xPos + 2 * (barWidth + barSpacing) + barWidth / 2, height - barHeightArea - 110);
    rotate(HALF_PI); // Rotacionar o texto 90 graus (vertical)
    fill ('white')
    text(data.totalArea.toFixed(2), 0, 0);
    pop();

    // Nome do continente
    textSize(constrain(width / 60, 10, 14));
    fill(255);
    text(continent, xPos + groupWidth / 2, height - 30);

    xPos += groupWidth + padding;
  }

  drawLegend();
}

function calculateDimensions() {
  let numContinents = Object.keys(continentData).length;

  let availableWidth = width - 90; // Largura disponível
  let maxGroupWidth = availableWidth / numContinents;

  groupWidth = min(maxGroupWidth, 200); // Limitar o tamanho máximo de um grupo
  barWidth = groupWidth / 5; // Cada grupo contém 3 barras, ajustamos a largura proporcionalmente
  barSpacing = barWidth / 2;
  padding = barWidth; // Espaçamento entre os grupos
}

function drawLegend() {
  textSize(constrain(width / 80, 10, 14));
  textAlign(LEFT);

  fill(100, 200, 255);
  rect(20, 20, 20, 20);
  fill(255);
  text("Discharge", 50, 35);

  fill(150, 255, 100);
  rect(20, 50, 20, 20);
  fill(255);
  text("Length", 50, 65);

  fill(255, 200, 100);
  rect(20, 80, 20, 20);
  fill(255);
  text("Area", 50, 95);
}

function drawGradientBar(x, y, w, h, c1, c2) {
  for (let i = 0; i < h; i++) {
    let inter = map(i, 0, h, 0, 1); // Interpolação das cores
    let c = lerpColor(c1, c2, inter); // Cor interpolada
    stroke(c);
    line(x, y + i, x + w, y + i); // Desenha a linha da barra
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawBarChart();
}
