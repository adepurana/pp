$(function() {
    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
});


function cleanNotif(){
  $("#notification").removeClass()
  $("#notification").html("")
  $("#notification").hide()
}

function clean(){
  $("#txt-letter-upd").val("")
  $("#txt-freq-upd").val("")
  $("#txt-freq").val("")
  $("#txt-letter").val("")
  $("#panel-upd").hide()
  $("#panel-add").hide()
  cleanNotif()
}

function deleteBtn(){
  $(".btn-delete").each(function(){
    $(this).on("click", function(event){
      let btnId = $(this).attr("data-id");
      let letter = $(this).attr("data-letter");
      let freq = $(this).attr("data-freq");
      $.ajax({
        url:`http://localhost:3000/API/letter/${btnId}`,
        type: 'DELETE',
        success: function(result){
            loadData()
            clean()

            // deletenotification
            $("#notification").show()
            $("#notification").html(`Letter <b>${letter}</b> , Frequency <b>${freq}</b> is deleted`)
            $("#notification").removeClass();
            $("#notification").addClass( "alert alert-danger" );

        }
      })
    })
  })
}

function editBtn(){
  $(".btn-update").each(function(){
    $(this).on("click", function(event){

      let btnId = $(this).attr("data-id");
      let letter = $(this).attr("data-letter");
      let freq = $(this).attr("data-freq");

      $("#txt-letter-upd").val(letter);
      $("#txt-freq-upd").val(freq);
      $("#panel-upd").show()
      $("#btn-update").attr("data-id",btnId);
      cleanNotif()
    })
  })
}


function loadData(){
  $.ajax({
    url:'http://localhost:3000/API/letter',
    type: 'GET',
    success: function(result){
      let html=
        `<table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Letter</th>
              <th>Frequency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>`
        for(let i in result){
          html+=
          `<tr>
            <th scope="row">${parseInt(i)+1}</th>
            <td>${result[i].letter}</td>
            <td>${result[i].freq}</td>
            <td>
              <button type="button" class="btn btn-success btn-update" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> update
              </button>
              <button type="button" class="btn btn-danger btn-delete" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> delete
              </button>
            </td>
          </tr>`
        }
          html+=
          `</tbody>
        </table>`

      $("#content").html(html)
      editBtn()
      deleteBtn()
    }
  })
}

$(function(){
  $("#panel-add").hide()
  $("#panel-upd").hide()
  $("#notification").hide()
  loadData()

  $("#btn-add").click(function(){
    cleanNotif()
    $("#panel-add").show()
  })

  $("#btn-add-save").click(function(){
    let val = $( "#txt-letter-add" ).val();
    let freq = $( "#txt-freq-add" ).val();
    let letter = val.toUpperCase()
    if(val=="" || freq==""){
      // requirednotification
      $("#notification").show()
      $("#notification").html(`<b>Letter</b> and <b>Frequency</b> are mandatory field`)
      $("#notification").removeClass();
      $("#notification").addClass( "alert alert-danger" );
    }
    else{
      $.ajax({
        url:'http://localhost:3000/API/letter',
        type: 'POST',
        data: {letter: letter, freq:freq},
        success: function(result){
            loadData()
            clean()
            // addnotification
            $("#notification").show()
            $("#notification").html(`Letter <b>${letter}</b> , Frequency <b>${freq}</b> is added`)
            $("#notification").removeClass();
            $("#notification").addClass( "alert alert-success" );
        }
      })
    }
  })

  $( "#txt-freq" ).keyup(function() {
    let val = $(this).val()
    let key = val.toUpperCase()
    if(val=="")loadData()
    else{

      $.ajax({
        url:`http://localhost:3000/API/searchletter2/${key}`,
        type: 'GET',
        success: function(result){
          let html=
            `<table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Letter</th>
                  <th>Frequency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>`
            for(let i in result){
              html+=
              `<tr>
                <th scope="row">${parseInt(i)+1}</th>
                <td>${result[i].letter}</td>
                <td>${result[i].freq}</td>
                <td>
                  <button type="button" class="btn btn-success btn-update" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> update
                  </button>
                  <button type="button" class="btn btn-danger btn-delete" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> delete
                  </button>
                </td>
              </tr>`
            }
              html+=
              `</tbody>
            </table>`

          $("#content").html(html)
          editBtn()
          deleteBtn()
        }
      })
    }
  });

  $( "#txt-letter" ).keyup(function() {
    let val = $(this).val()
    let key = val.toUpperCase()
    if(val=="")loadData()
    else{

      $.ajax({
        url:`http://localhost:3000/API/searchletter/${key}`,
        type: 'GET',
        success: function(result){
          let html=
            `<table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Letter</th>
                  <th>Frequency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>`
            for(let i in result){
              html+=
              `<tr>
                <th scope="row">${parseInt(i)+1}</th>
                <td>${result[i].letter}</td>
                <td>${result[i].freq}</td>
                <td>
                  <button type="button" class="btn btn-success btn-update" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> update
                  </button>
                  <button type="button" class="btn btn-danger btn-delete" data-id="${result[i]._id}" data-letter="${result[i].letter}" data-freq="${result[i].freq}">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> delete
                  </button>
                </td>
              </tr>`
            }
              html+=
              `</tbody>
            </table>`

          $("#content").html(html)
          editBtn()
          deleteBtn()
        }
      })
    }
  });

  $("#btn-update").click(function(){
    let letter = $( "#txt-letter-upd" ).val();
    let freq = $( "#txt-freq-upd" ).val();
    let id = $(this).attr("data-id");
    $.ajax({
      url:`http://localhost:3000/API/letter/${id}`,
      type: 'PUT',
      data: {letter: letter.toUpperCase(), freq:freq.toUpperCase()},
      success: function(result){
          loadData()
          clean()
          // updatenotification
          $("#notification").show()
          $("#notification").html(`Data is updated to Letter <b>${letter.toUpperCase()}</b> , Frequency <b>${freq}</b>`)
          $("#notification").removeClass();
          $("#notification").addClass( "alert alert-warning" );

      }
    })
  })

})
