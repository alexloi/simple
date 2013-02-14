$(document).ready(function () {
  
  $('#dropbox').bind('click', function(e){
    console.log('ajax dorpbox');
    $.ajax({
      url: "/connect",
      method: "GET"
      }
    ).done(function ( data ) {
      console.log('Connect',data);
      window.location = data.toString();
    }).fail(function(jqXHR,textStatus){
      console.log('I JUST FAILED', jqXHR, textStatus);
    }).always(function(jqXHR,textStatus){
      console.log('i got executed');
    });
  });
  

});
