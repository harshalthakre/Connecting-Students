$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form input');
      var todo = {rollno: rollno.val(),password:password.val(),department:department.val()};

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });


});
