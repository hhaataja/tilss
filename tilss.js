$(document).ready(function(){
      // Manage lists
      var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');

      function displayList(list) {
          var name = list.name();
          var childData = list.val();
          $('#listsDiv').append("<div id='listDiv"+name+"'> "+
               "<h4>"+childData.listname+"<h4/>"+
               "<ul id='itemsDiv"+name+"'></ul>"+
               "<input type='text' class='additem' id='additem"+name+"' placeholder='Beer'/>"+
               "<button id='additemButton"+name+"' type='button' value='"+name+"' class='addItemButton'>add</button><br/></div>");

          $("#additemButton"+name).click(function (e) {
            var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');
            var id = e.target.value;
            var elem = $("#additem"+id);
            var value = elem.val();
            myDataRef.child(id).child("items").push({listid: id, item: value});
          });

          var dataSnapshot = list.child("items");
          dataSnapshot.forEach(function(itemData) {
            var name = itemData.name();
            var item = itemData.val();
            $("#itemsDiv"+item.listid).append("<li id='"+name+"'>"+item.item+"</li>")
          });
      };


      $('#listname').keypress(function (e) {
        if (e.keyCode == 13) {
          var username = $('#username').val();
          var listname = $('#listname').val();
          myDataRef.push({listname: listname, username: username});
          $('#listname').val('');
        }
      });

      myDataRef.on('child_added', function(snapshot) {
        displayList(snapshot);
      });


      function addItem(list){

      };




});
