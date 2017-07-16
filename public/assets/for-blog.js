$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form textarea');
      var todo = {blog:item.val()};

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
