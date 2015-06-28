function OnlineSpeechRecognition() {
  this.recorder = null;
  this.recording = false;
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
        this.recorder = new Recorder(mediaStreamSource);
        this.recording = true;
        console.log(this);
        this.recorder.record();
      }.bind(this),function(error){
        console.log(err)
      });
    }
  }.bind(this);

  this.stopReccognition = function() {
    console.log(this);
    if(this.recording){
      this.recording=false;
      this.recorder.stop();
      this.stream.stop();
      this.recorder.exportWAV(function (sound_blob) {
        var fd = new FormData();
        fd.append('fname', 'speech.wav');
        fd.append('data', sound_blob);
        $.ajax({
            type: 'POST',
            url: '/speech_to_text',
            data: fd,
            processData: false,
            contentType: false,
            success: function(data) {
              $('#search-input').val(data.hypothesis);
            }
        })
      });
    }
  }.bind(this);
}

function OfflineSpeechRecognition() {
    this.transcript = ""
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = function(){
      console.log("Startet")
    }

    this.recognition.onerror = function(e) {
      //console.log(e)
    }

    this.recognition.onspeechend = function(e) {
      console.log("end");
    }

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
    }

    this.stopReccognition = function(){
      this.recognition.stop();
    }
}

window.SpeechRecognition = (typeof(webkitSpeechRecognition) != 'undefined') ? new OfflineSpeechRecognition : new OnlineSpeechRecognition


$(document).on('click','#start-recording',function(){
  window.SpeechRecognition.startRecognition()
})

$(document).on('click','#stop-recording',function(){
  window.SpeechRecognition.stopReccognition()
})
