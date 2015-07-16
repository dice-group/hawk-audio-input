function OnlineSpeechRecognition() {
  this.wsclient = new WebSocket("ws://" + location.host + "/speech_to_text");

  this.wsclient.onmessage = function(msg) {
    $('#search-input').val(msg.data);
    //$('#search-form').submit();
  };

  this.recording = false;
  this.recorder = null;
  this.stream = null;
  this.mediaStreamSource = null;

  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  this.startRecognition = function() {
    if(!this.recording) {
      navigator.getUserMedia({audio: true}, function(stream){
        $("#mic-active").toggle();
        $("#mic-inactive").toggle();

        this.stream=stream
        var context = new AudioContext();

        this.mediaStreamSource = context.createMediaStreamSource(stream)

        this.recording = true;
        this.recorder = context.createScriptProcessor(2048, 1, 1);
        this.recorder.onaudioprocess = this.processChunk;


        this.mediaStreamSource.connect(this.recorder);
        this.recorder.connect(context.destination);

      }.bind(this),function(error){
          console.log("foo");

      });
    }
  }.bind(this);

  this.processChunk = function(streamData) {
      var buffer = streamData.inputBuffer.getChannelData(0);
      this.wsclient.send(this.convertFloat32ToInt16(buffer));
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
      this.mediaStreamSource.disconnect();
      this.recorder.disconnect();

      $("#search-input").val("Analyzing Speech")
      setTimeout(function(){
        this.wsclient.send("get_hypothesis")
      }.bind(this),1000);
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
      $("#mic-active").toggle();
      $("#mic-inactive").toggle();
      this.recording=true;
    }.bind(this)

    this.recognition.onend = function() {
      this.recording=false;
      $("#mic-active").toggle();
      $("#mic-inactive").toggle();
    }.bind(this)

    this.recognition.onerror = function(e) {
      this.recording=false;
      $("#mic-active").toggle();
      $("#mic-inactive").toggle();
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
    }.bind(this)

    this.startRecognition = function(){
      this.transcript = "";
      this.recognition.start();
    }.bind(this);

    this.stopReccognition = function(){
      this.recognition.stop();
      $("#search-form").submit();
    }.bind(this);
}

window.SpeechRecognition = (typeof(webkitSpeechRecognition) != 'undefined') ? new OfflineSpeechRecognition : new OnlineSpeechRecognition


$(document).on('click','.mic-box',function(){
  if(window.SpeechRecognition.recording) {
    window.SpeechRecognition.stopReccognition();
    $("#mic-active").toggle();
    $("#mic-inactive").toggle();
  } else {
    window.SpeechRecognition.startRecognition();
  }
})
