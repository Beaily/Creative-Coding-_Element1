var song;
var amp;
var button;
var fft; 
var volhistory = [];
var img1, img2; 
var prevVol = 0; 
var changeRateThreshold = 7; 
var prevPeakFreq = 0; 

function clickSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound('voice_tone.mp3');
  img1 = loadImage('img_High.jpg'); 
  img2 = loadImage('img_Low.jpg'); 
}

function setup() {
  createCanvas(windowWidth, 400);
  button = createButton('click');
  button.mousePressed(clickSong);
  song.play();
  amp = new p5.Amplitude();
  fft = new p5.FFT(); 
}

function draw() {
  background(255);
  var vol = amp.getLevel();
  var spectrum = fft.analyze();
  var peakFreq = fft.getEnergy('bass', 'treble'); 

  volhistory.push(vol);

  var rapidChange = false;
  if (volhistory.length > 1) {
    var volChange = abs(volhistory[volhistory.length - 1] - volhistory[volhistory.length - 2]);
    var freqChange = abs(peakFreq - prevPeakFreq);

    if (volChange > changeRateThreshold || freqChange > changeRateThreshold) {
      rapidChange = true;
    }
  }

  prevPeakFreq = peakFreq;

  if (rapidChange) {
    image(img2, 10, 10, 50, 40); 
  } else {
    image(img1, 10, 10, 100, 60); 
  }

  
  noStroke();
  fill(245, map(vol, 0, 1, 0, 50), 220, map(vol, 0, 1, 0, 150));
  beginShape();
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height / 2 - 50 * sin(i * 4), 0);
    ellipse(i * 2, y, 50, 50);
  }
  endShape();

  if (volhistory.length > width / 2) {
    volhistory.splice(0, 1);
  }
}
