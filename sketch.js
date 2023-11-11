
function preload(){
  firstPassShader = loadShader('blurShader.vert', 'blurShader.frag');
  secondPassShader = loadShader('blurShader.vert', 'blurShader.frag');
  sinePassShader = loadShader('sineShader.vert', 'sineShader.frag');
  font = loadFont('helvetica.ttf');
}

function setup(){
  console.log(offsetX);
  
  createCanvas(windowWidth, windowHeight);

  firstPassCanvas = createGraphics(windowWidth, windowHeight, WEBGL);
  secondPassCanvas = createGraphics(windowWidth, windowHeight, WEBGL);
  sinePassCanvas = createGraphics(windowWidth, windowHeight, WEBGL);

  firstPassCanvas.smooth();
  secondPassCanvas.smooth();
  sinePassCanvas.smooth();
  smooth();

  textCanvas = createGraphics(windowWidth, windowHeight);
  checkForMobile();
  resetTextCanvas();
  // blur shader uniforms
  numSamples = 129;
  weightOffsets = [];
  passNum = 0;
  for (let i = 0; i < numSamples; i++){
    weightOffsets.push([offsetX[i], offsetY[i]]);
  }

  
}

function draw(){
  background(220);
  
  firstPassCanvas.shader(firstPassShader);
  firstPassShader.setUniform('resolution', [width, height]);
  firstPassShader.setUniform('tex', textCanvas);
  firstPassShader.setUniform('weightOffsetsX', offsetX);
  firstPassShader.setUniform('weightOffsetsY', offsetY);
  firstPassShader.setUniform('numSamples', numSamples);
  firstPassShader.setUniform('flipY', true);
  firstPassShader.setUniform('isSecondPass', false);
  firstPassCanvas.rect(0, 0, 50, 50);

  secondPassCanvas.shader(secondPassShader);
  secondPassShader.setUniform('resolution', [width, height]);
  secondPassShader.setUniform('tex', firstPassCanvas);
  secondPassShader.setUniform('weightOffsetsX', offsetX);
  secondPassShader.setUniform('weightOffsetsY', offsetY);
  secondPassShader.setUniform('numSamples', numSamples);
  secondPassShader.setUniform('flipY', true);
  secondPassShader.setUniform('isSecondPass', true);
  secondPassCanvas.rect(0, 0, 50, 50);

  sinePassCanvas.shader(sinePassShader);
  sinePassShader.setUniform('resolution', [width, height]);
  sinePassShader.setUniform('tex', secondPassCanvas);
  sinePassShader.setUniform('flipY', true);
  sinePassShader.setUniform('time', frameCount * 0.2);
  sinePassShader.setUniform('sinDensity', 100);
  sinePassCanvas.rect(0, 0, 50, 50);

  image(sinePassCanvas, 0, 0, width, height);
  image(textCanvas,  0, 0, width * 0.25, height * 0.25);

 
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  firstPassCanvas.resizeCanvas(windowWidth, windowHeight);
  secondPassCanvas.resizeCanvas(windowWidth, windowHeight);
  sinePassCanvas.resizeCanvas(windowWidth, windowHeight);
  textCanvas.resizeCanvas(windowWidth, windowHeight);
  resetTextCanvas();
}

function resetTextCanvas(){
  textCanvas.clear();
  textCanvas.background(0);
  textCanvas.textAlign(CENTER, CENTER);
  textCanvas.textFont(font);
  textCanvas.fill(255);

  if (windowWidth < windowHeight){
    let boundaryX = 0.15 * windowWidth;
    let w = (windowWidth - 2 * boundaryX) * 0.25;

    let boundaryY = 0.2 * windowHeight;
    let h = (windowHeight - 2 * boundaryY) * 0.25;

    let str = 'EXP&';

    textCanvas.textSize(windowHeight * 0.3);
    for (let i = 0; i < 4; i++){
      let posX = boundaryX + w * 0.5 * (2 * i + 1);
      let posY = boundaryY + h * 0.5 * (2 * i + 1);
      textCanvas.text(str[i], posX, posY);
    }
  }

  else{ 
    textCanvas.textSize(windowHeight * 0.4);
    textCanvas.text("EXP&", textCanvas.width * 0.5, textCanvas.height * 0.5);
  }
}

function checkForMobile(){
  let isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  if (isMobile){
    console.log("HEY");
    pixelDensity(0.75);
    textCanvas.pixelDensity(0.75);
    firstPassCanvas.pixelDensity(0.75);
    secondPassCanvas.pixelDensity(0.75);
    sinePassCanvas.pixelDensity(0.75);
  }
}