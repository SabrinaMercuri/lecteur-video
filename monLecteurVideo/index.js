import './lib/webaudio-controls.js';

const ctx = window.AudioContext || window.webkitAudioContext
const context = new ctx()
const getBaseURL = () => {
  return new URL('.',
    import.meta.url);
};

let style = `
div.controls:hover {
    color:blue;
    font-weight:bold;
  }
  div.controls label {
    display: inline-block;
    text-align: center;
    width: 50px;
  }
  
  div.controls label, div.controls input, output {
      vertical-align: middle;
      padding: 0;
      margin: 0;
     font-family: "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
    font-size: 12px;
  }

  .contenu {
    display: flex;
    width: 100%;
    color : white;
    min-height: 100vh;
  }

  .videoPlayer {
    background-color: #9DA9CE;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #player {
    height: 400px;
    width: 600px;
  }

  .nextVideo {
    background-color: #9DA9CE;
    width: 30%;
    display: flex;
    flex-direction: column;
  }

  .player-progress-container {
    display: flex;
    flex-direction: row;
  }

  .player-progress-number-container {
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
  }
  
  #progress-bar {
    width: 500px;
  }
  progress {
    border: 1px solid #5a67d8;
  }
  
  progress::-webkit-progress-value {
    background: lightblue;
  }
  
  progress::-webkit-progress-value {
    background: #5a67d8;
  }
  
  progress::-webkit-progress-bar {
    background: #edf2f7;
  }
 
  #vitesse {
    margin-left: 2rem;
    margin-right: 3rem;
  }

  #volume1 {
    margin-left: 1rem;
  }
 
  #info {
    margin-left: 8rem;
    border-radius: 10px;
  }

  .change {
    margin-left: 6rem;
  }

  #video-deux {
    margin-top: 30px;
  }

  #video-une:hover { border: 1px solid yellow; }
  #video-deux:hover { border: 1px solid yellow; }
  #video-trois:hover { border: 1px solid yellow; }
  #video-quatre:hover { border: 1px solid yellow; }

  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 150px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
  }
  
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  #playlist {
    margin-top : 30px;
  }

  `;
let template = /*html*/ `
<div class="contenu">
<div class="videoPlayer">
  <video id="player" crossorigin="anonymous">
      <br>
  </video>
  <br>
 

  <div class="player-progress-container">
  <progress class="mb-4 w-full" id="progress-bar" min="0" max="0" value="0" step="1"></progress>
  <div class="player-progress-number-container">
    <span id="progress-current"></span>
    <span>/</span>
    <span id="progress-max"></span>
  </div>
</div>

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <br>
  <div class="change">
  <button id="precedent"><i class="material-icons">skip_previous</i></button>
  <button id="recule10"><i class="material-icons">fast_rewind</i></button>
  <button id="play"><i class="material-icons">play_arrow</i></button>
  <button id="pause"><i class="material-icons">pause</i></button>
  <button id="stop"><i class="material-icons">stop</i></button>
  <button id="avance10"><i class="material-icons">fast_forward</i></button>
  <button id="suivant"><i class="material-icons">skip_next</i></button>
  <button id="info" class="tooltip">ℹ️ <span class="tooltiptext" id="tool"></span></button>
  
  <br>
  <br>
  <span id="vitesse">Vitesse : <button id="vitesse1">x1</button><button id="vitesse4">x4</button></span>
  <span id="volume1">Volume :<webaudio-knob id="volume" min=0 max=1 value=0.5 step="0.01" 
          diameter="40" src="./assets/LittlePhatty.png" sprites="100"></webaudio-knob></span>
         
         </div>
         <br>
         <br>
<span>Fréquences : </span>
<br>
         <div class="controls">
             <label>60Hz</label>
             <input id="control0" type="range" value="0" step="1" min="-30" max="30"></input>
           <output id="gain0">0 dB</output>
           </div>
           <div class="controls">
             <label>170Hz</label>
             <input id="control1" type="range" value="0" step="1" min="-30" max="30"></input>
         <output id="gain1">0 dB</output>
           </div>
           <div class="controls">
             <label>350Hz</label>
             <input id="control2" type="range" value="0" step="1" min="-30" max="30"></input>
         <output id="gain2">0 dB</output>
           </div>
           <div class="controls">
             <label>1000Hz</label>
             <input id="control3" type="range" value="0" step="1" min="-30" max="30"></input>
         <output id="gain3">0 dB</output>
           </div>
           <div class="controls">
             <label>3500Hz</label>
             <input id="control4" type="range" value="0" step="1" min="-30" max="30"></input>
         <output id="gain4">0 dB</output>
           </div>
           <div class="controls">
             <label>10000Hz</label>
             <input id="control5" type="range" value="0" step="1" min="-30" max="30"></input>
         <output id="gain5">0 dB</output>
           </div>
           <br>
           <canvas id="myCanvas" width=400 height=100></canvas>
           </div>

           <div class="nextVideo">
           <h3 id="playlist">Playlist : </h3>
           <img id="video-deux" src="./assets/pluie.png" id="pluie" width="150" height="100">
           <br>
           <img id="video-trois" src="./assets/carillon.png" id="carillon" width="150" height="100">
           <br>
           <img id="video-quatre" src="./assets/musique.png" id="musique" width="150" height="100">
           <br>
           </div>
           </div>
   `;

class MyVideoPlayer extends HTMLElement {
  constructor() {
    super();

    this.filters = [];
    console.log("BaseURL = " + getBaseURL());

    this.attachShadow({
      mode: "open"
    });

    this.mesVideos = 0; ///video html
    this.tabVideo = [
      "./monLecteurVideo/assets/pluie.mp4",
      "./monLecteurVideo/assets/carillon.mp4",
      "./monLecteurVideo/assets/musique.mp4"
    ]

  }

  fixRelativeURLs() {
    // pour les knobs
    let knobs = this.shadowRoot.querySelectorAll('webaudio-knob, webaudio-switch, webaudio-slider, img');
    knobs.forEach((e) => {
      let path = e.getAttribute('src');
      e.src = getBaseURL() + '/' + path;
    });
  }
  connectedCallback() {
    // Appelée avant affichage du composant
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
    /// ou "<style> " + style +"</style> " + template

    this.fixRelativeURLs();

    this.player = this.shadowRoot.querySelector("#player");
    // récupération de l'attribut HTML
    this.player.src = this.getAttribute("src");



    // create the equalizer. It's a set of biquad Filters
    this.sourceNode = context.createMediaElementSource(this.player);

    // Init filters
    this.filterinit()

    // Connect filters in serie
    this.sourceNode.connect(this.filters[0]);
    for (var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    // connect the last filter to the speakers
    this.filters[this.filters.length - 1].connect(context.destination);


    this.shadowRoot.querySelector("#control0").oninput = (event) => this.setFilter(event.target.value, 0)
    this.shadowRoot.querySelector("#control1").oninput = (event) => this.setFilter(event.target.value, 1)
    this.shadowRoot.querySelector("#control2").oninput = (event) => this.setFilter(event.target.value, 2)
    this.shadowRoot.querySelector("#control3").oninput = (event) => this.setFilter(event.target.value, 3)
    this.shadowRoot.querySelector("#control4").oninput = (event) => this.setFilter(event.target.value, 4)
    this.shadowRoot.querySelector("#control5").oninput = (event) => this.setFilter(event.target.value, 5)

    this.progressBar = this.shadowRoot.getElementById("progress-bar");
    this.timeCurrent = this.shadowRoot.getElementById("progress-current");
    this.timeMax = this.shadowRoot.getElementById("progress-max");

    this.canvas = this.shadowRoot.getElementById("myCanvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasContext = this.canvas.getContext("2d");

    this.buildAudioGraph();
    requestAnimationFrame(() => {
      this.visualize2()
    })


    // déclarer les écouteurs sur les boutons
    this.definitEcouteurs();
    this.avancement();

  }

  definitEcouteurs() {
    console.log("ecouteurs définis")
    this.shadowRoot.querySelector("#play").onclick = () => {
      /*this.play();*/
      this.player.play();
    }
    this.shadowRoot.querySelector("#pause").onclick = () => {
      /*this.pause();*/
      this.player.pause();
    }

    this.shadowRoot.querySelector("#stop").onclick = () => {
      this.player.pause();
      this.player.currentTime = 0;
    }

    this.shadowRoot.querySelector("#volume").oninput = (event) => {
      const vol = parseFloat(event.target.value);
      this.player.volume = vol;
    }

    this.shadowRoot.querySelector("#avance10").onclick = () => {
      this.player.currentTime += 10;
    }

    this.shadowRoot.querySelector("#recule10").onclick = () => {
      this.player.currentTime -= 10;
    }

    this.shadowRoot.querySelector("#vitesse1").onclick = () => {
      this.player.playbackRate = 1;
    }

    this.shadowRoot.querySelector("#vitesse4").onclick = () => {
      this.player.playbackRate = 4;
    }

    this.shadowRoot.querySelector("#suivant").onclick = () => this.suivant()

    this.shadowRoot.querySelector("#precedent").onclick = () => this.precedent()

    this.shadowRoot.querySelector("#info").onmouseover = (event) => {
      let popup = this.shadowRoot.querySelector("#tool")
      popup.innerHTML= "Durée de la vidéo : " + this.player.duration + "</br> Temps courant : " + this.player.currentTime
    }

    /*this.shadowRoot.querySelector("#video-une").onclick = () => {
      this.mesVideos=0;
      this.player.src= this.tabVideo[this.mesVideos];
    }*/

    this.shadowRoot.querySelector("#video-deux").onclick = () => {
      this.mesVideos = 0;
      this.player.src = this.tabVideo[this.mesVideos];
    }

    this.shadowRoot.querySelector("#video-trois").onclick = () => {
      this.mesVideos = 1;
      this.player.src = this.tabVideo[this.mesVideos];
    }

    this.shadowRoot.querySelector("#video-quatre").onclick = () => {
      this.mesVideos = 2;
      this.player.src = this.tabVideo[this.mesVideos];
    }

  }

  buildAudioGraph() {

    // Create an analyser node
    this.analyser = context.createAnalyser();

    // Try changing for lower values: 512, 256, 128, 64...
    this.analyser.fftSize = 512;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    // connect the last filter to the speakers
    this.filters[this.filters.length - 1].connect(this.analyser);

    this.analyser.connect(context.destination);
  }

  visualize2() {
    this.canvasContext.save();
    this.canvasContext.fillStyle = "#9DA9CE";
    this.canvasContext.fillRect(0, 0, this.width, this.height);

    this.analyser.getByteFrequencyData(this.dataArray);
    var nbFreq = this.dataArray.length;

    var SPACER_WIDTH = 5;
    var BAR_WIDTH = 2;
    var OFFSET = 100;
    var CUTOFF = 23;
    var HALF_HEIGHT = this.height / 2;
    var numBars = 1.7 * Math.round(this.width / SPACER_WIDTH);
    var magnitude;

    this.canvasContext.lineCap = 'round';

    for (var i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];

      this.canvasContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
      this.canvasContext.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, -magnitude);
      this.canvasContext.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, magnitude);
    }

    // Draw animated white lines top
    this.canvasContext.strokeStyle = "white";
    this.canvasContext.beginPath();

    for (i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];
      if (i > 0) {
        //console.log("line lineTo "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContext.lineTo(i * SPACER_WIDTH, HALF_HEIGHT - magnitude);
      } else {
        //console.log("line moveto "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContext.moveTo(i * SPACER_WIDTH, HALF_HEIGHT - magnitude);
      }
    }
    for (i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];
      if (i > 0) {
        //console.log("line lineTo "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContext.lineTo(i * SPACER_WIDTH, HALF_HEIGHT + magnitude);
      } else {
        //console.log("line moveto "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContext.moveTo(i * SPACER_WIDTH, HALF_HEIGHT + magnitude);
      }
    }
    this.canvasContext.stroke();

    this.canvasContext.restore();

    requestAnimationFrame(() => {
      this.visualize2()
    })
  }

  suivant() {
    ///pour passer de la 4 à la 1
    if (this.mesVideos == 2) {
      this.mesVideos = 0;
    } else {
      this.mesVideos++;
    }
    this.player.src = this.tabVideo[this.mesVideos];
  }

  precedent() {
    if (this.mesVideos == 0) {
      this.mesVideos = 2;
    } else {
      this.mesVideos--;
    }
    this.player.src = this.tabVideo[this.mesVideos];

  }

  avancement() {
    this.player.ontimeupdate = (event) => {
      if (!isNaN(this.player.duration)) {
        const time = event.target.currentTime;
        this.progressBar.value = event.target.currentTime;
        const minutes = Math.floor(time / 60);
        const seconds = (time - minutes * 60).toFixed(0);
        this.timeCurrent.innerHTML = `${minutes}:${this.changeNb(seconds)}`;
      }
    };

    this.player.onloadedmetadata = () => {
      this.progressBar.max = this.player.duration;

      const minutes = Math.floor(this.player.duration / 60);
      const seconds = (this.player.duration - minutes * 60).toFixed(0);

      this.timeCurrent.innerHTML = "0:00";
      this.timeMax.innerHTML = `${minutes}:${this.changeNb(seconds)}`;
    };

    this.player.onplay = () => {
      context.resume();
    };

    // Progress
    this.progressBar.onclick = (event) => {
      const x = event.pageX - this.progressBar.offsetLeft;
      const y = event.pageY - this.progressBar.offsetTop;
      const clickedValue = (x * this.progressBar.max) / this.progressBar.offsetWidth;
      this.player.currentTime = clickedValue;
    };
  }

  // API de mon composant
  /*play() {this.player.play();}
  pause() {this.player.pause();}*/

  changeNb(baseNumber) {
    return ("0" + baseNumber).slice(-2);
  }

  filterinit() {
    let tableau = [60, 170, 350, 1000, 3500, 10000]
    this.filters = []
    for (let freq of tableau) {
      let eq = context.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    }
  }
  setFilter(sliderVal, nbFilter) {
    let value = parseFloat(sliderVal);
    this.filters[nbFilter].gain.value = value;

    // update output labels
    let output = this.shadowRoot.querySelector("#gain" + nbFilter);
    output.innerHTML = value + " dB";
  }

}

customElements.define("my-player", MyVideoPlayer);