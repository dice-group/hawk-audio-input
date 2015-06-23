var navigator = window.navigator;
navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

var recorder

function startRecording() {
   navigator.getUserMedia({audio: true}, micAccessGranted, micAccessDenied);
}

function stopRecording() {
   recorder.stop();
   recorder.exportWAV(function (blob) {
       upload(blob);
   });
}

function micAccessDenied(error) {
    console.log('Rejected!', error);
};

function micAccessGranted(stream) {
    var context = new AudioContext();
    var mediaStreamSource = context.createMediaStreamSource(stream);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();
}

function upload(soundBlob) {
  var fd = new FormData();
  fd.append('fname', 'speech.wav');
  fd.append('data', soundBlob);
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
}

$(document).on('click','#start-recording',function(){
  startRecording();
})

$(document).on('click','#stop-recording',function(){
  stopRecording();
})
