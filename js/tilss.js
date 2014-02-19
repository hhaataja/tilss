$(document).ready(function(){
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
    var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');
    myDataRef.child(self.listid()).child("items").on('child_added', function(snapshot) {
      self.items.push(new ListItemModel(snapshot));
    });

    self.addNewItem = function(list){
      var listid = list.listid();
      var newitem = $('#newitem'+list.listid()).val();
      //self.items.push(newitem);
      var myDataRef = new Firebase('https://tilss.firebaseio.com/lists');
      myDataRef.child(listid).child("items").push({listid: listid, item: newitem});
      $('#newitem'+list.listid()).val('');
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
