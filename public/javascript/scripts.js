//submit the search form whenever the search button is pressed
$(document).on("click","#search-button", function(){
  $("#search-form").submit();
});



function checkForUpdates(uuid){
  $.get('/status/'+uuid,function(data){
    if(data!=null) {
      showResults(data)
    }else {
      window.setTimeout(function() {
        checkForUpdates(uuid);
      },2000);
    }
  });
}

function showResults(data){
  $("#spinner").hide();
  if(data['answers'].length > 0) {
    $.each(data['answers'],displayAnswer);

    if(data['audio_answer']!=null) {
      var snd = new Audio("data:audio/wav;base64,"+data['audio_answer']);
      snd.play();
    }
  } else {
    $("#not-found").show();
  }
}

function displayAnswer(i,answer) {
  console.log(answer);
  $('#answers').loadTemplate('#answer-template',answer,{append: true});
}
