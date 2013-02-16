var masterKey = "";
var obj = {};

$(window).load(function(){
  $("#masterModal").reveal({
    closeOnBackgroundClick: false,
    closeOnEsc: false
  });

  $("#closeMasterModal").bind('click', function(e){
    $("#masterModal").trigger('reveal:close');
    masterKey = $("#masterKey").val();
  });
})

$(document).ready(function(){
  $('#pushData').bind('click',function(e){
    e.preventDefault();
    console.log('click', masterKey);
    pushDataObj();
  });

  $('#pullData').bind('click',function(e){
    e.preventDefault();
    console.log('pull click', masterKey);
    pullDataObj();
  });
});


function pullDataObj(){
  // Get data obj form database
  $.ajax({
      url: '/data/retrieve',
      type: 'POST',
      data: {
        master: masterKey
      },
      success: function(data) {
        console.log("GOT DATA BACK:", data);
      },
      error: function(error){
        console.log("PULL DATA ERROR");
      }
    });
}

function pushDataObj(){
  // Gather alla data from all the forms and create a new dataObj
  $.ajax({
      url: '/data/store',
      type: 'post',
      data: {
        master: masterKey,
        phone: "chloe",
        ssn: "Donegan",
        csrf: $("#csrf").val()
      },
      success: function(data) {
        console.log("PUSH DATA SUCCESS:", data);
      },
      error: function(error){
        console.log("PUSH DATA ERROR",error);
      }

    });
}