let cancerI = 0;
let cancer;
const axi = new axidraw.AxiDraw();
let connected = false;

function preload() {
  data = loadJSON('cancer_data.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  textFont('IBM Plex Mono');
  textSize(16);
  cancer = data[cancerI];

  axi.connect().then(() => {
      connected = true;
  }).catch(error => {
      console.error("AxiDraw connection failed:", error);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

function mouseClicked() {
    if (!connected) {
        axi.connect().then(() => {
            connected = true;
        }).catch(error => {
            console.error("AxiDraw connection failed:", error);
        });
    }

    if (connected) {
        cancer = data[cancerI];
        cancerI = (cancerI + 1) % data.length;

        let x = map(cancer.year, 2003, 2016, 0, width); 
        let y = map(cancer.crudeRate, 15, 25, height, 0); 

        axi.moveTo(x, y);
        axi.penDown();
        axi.moveTo(x + 10, y + 10); 
        axi.penUp();
    }
}

function draw() {
    background(55, 250, 50);

    if (cancer) {
        noFill();
        stroke('green');
        circle(200, 200, cancer.crudeRate * 2);

        noStroke();
        fill('black');
        text("Year: " + cancer.year, 300, 20);
    }
}