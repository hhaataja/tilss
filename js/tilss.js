$(document).ready(function(){
      // Manage lists
  /*    var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');

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

      };*/


  // Knouckout Models and Views //

  function ListItemModel(itemData){
    var self = this;
    self.itemid = ko.observable(itemData ? itemData.name() : '');
    self.item = ko.observable(itemData ? itemData.val().item : '');
  }

  function ListModel(snapshot) {
    var self = this;
    self.listid = ko.observable(snapshot ? snapshot.name() : '');
    self.author = ko.observable(snapshot ? snapshot.val().username : '');
    self.listname = ko.observable(snapshot ? snapshot.val().listname : '');

    self.items = ko.observableArray();
    snapshot.child("items").forEach(function(itemData){
      self.items.push(new ListItemModel(itemData));
    });

    self.addNewItem = function(list){
      var listid = list.listid();
      var newitem = $('#newitem'+list.listid()).val();
      //self.items.push(newitem);
      var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');
      myDataRef.child(listid).child("items").push({listid: listid, item: newitem});
    }
  }

  function AppViewModel(){
    var self = this;
    self.lists = ko.observableArray();
    self.username = ko.observable("Jorkki");

    // Hook firebase db for updates
    var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');
    myDataRef.on('child_added', function(snapshot) {
      self.lists.push(new ListModel(snapshot));
    });

    self.addNewList = function(listData){
      var username = $('#username').val();
      var listname = $('#listname').val();
      myDataRef.push({listname: listname, username: username});
      $('#listname').val('');
    };
  }

  // Activates knockout.js
  ko.applyBindings(new AppViewModel());

});
