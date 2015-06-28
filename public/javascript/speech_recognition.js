function OnlineSpeechRecognition() {
  this.wsclient = new WebSocket('ws://localhost:9292/speech_to_text');
  this.wsclient.onopen = function() {
  };

  this.wsclient.onmessage = function(msg) {
    $('#search-input').val(msg.data);
  };

  this.recording = false;
  this.recorder = null;
  this.stream = null;

  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  this.startRecognition = function() {
    if(!this.recording) {
      navigator.getUserMedia({audio: true}, function(stream){
        this.stream=stream
        var context = new AudioContext();
        var mediaStreamSource = context.createMediaStreamSource(stream);
        this.recording = true;
        this.recorder = context.createScriptProcessor(2048, 1, 1);
        this.recorder.onaudioprocess = this.processChunk;
        mediaStreamSource.connect(this.recorder);
        this.recorder.connect(context.destination);

      }.bind(this),function(error){
        console.log(err)
      });
    }
  }.bind(this);

  this.processChunk = function(streamData) {
      var left = streamData.inputBuffer.getChannelData(0);
      this.wsclient.send(this.convertFloat32ToInt16(left));
  }.bind(this);

  this.convertFloat32ToInt16 = function(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
  }

  this.stopReccognition = function() {
    if(this.recording){
      this.recording=false;
      this.stream.stop();
      this.recorder.disconnect();
      this.wsclient.send("get_hypothesis")
    }
  }.bind(this);
}





function OfflineSpeechRecognition() {
    this.transcript = ""

    this.recording = false;

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = function(){
      this.recording=true;
    }.bind(this)

    this.recognition.onend = function() {
      this.recording=false;
    }.bind(this)

    this.recognition.onerror = function(e) {
      this.recording=false;
    }.bind(this)

    this.recognition.onresult = function(event) {
      interim_transcript = ""
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      $('#search-input').val(this.transcript + interim_transcript);
      setTimeout(this.stopReccognition,2000);
    }.bind(this)

    this.startRecognition = function(){
      this.transcript = "";
      this.recognition.start();
    }.bind(this);

    this.stopReccognition = function(){
      this.recognition.stop();
    }.bind(this);
}

window.SpeechRecognition = (typeof(webkitSpeechRecognition) != 'undefined') ? new OfflineSpeechRecognition : new OnlineSpeechRecognition


$(document).on('click','#start-recording',function(){
  window.SpeechRecognition.startRecognition()
})

$(document).on('click','#stop-recording',function(){
  window.SpeechRecognition.stopReccognition()
})
