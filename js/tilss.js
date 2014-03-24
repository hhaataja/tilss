  var loggedUser = null;
  var userid = null;
  // Firebase configs
  var FIREBASE_ADDR = "https://tilss-db.firebaseio.com";
  var loginRef = new Firebase(FIREBASE_ADDR);
  var myDataRef = null;

  //Create an Firebase Simple Login client so we can do Facebook auth
  var auth = new FirebaseSimpleLogin(loginRef, function(error, user) {
    if(user) {
      loggedUser = user;
      userid = user.id;
      myDataRef = new Firebase(FIREBASE_ADDR+"/"+userid);
      ko.applyBindings(new AppViewModel(myDataRef));
    }
  });

  // Knouckout Models and Views //
  function ListItemModel(itemData){
     var self = this;
    self.itemid = ko.observable(itemData ? itemData.name() : '');
    self.listid = itemData ? itemData.val().listid : '';
    self.item = ko.observable(itemData ? itemData.val().item : '');
    self.newitem = ko.observable(itemData ? itemData.val().item : '');

    self.deleteItem = function(item){
      var listid = item.listid;
      var itemid = item.itemid();
      myDataRef.child(listid).child("items").child(itemid).remove();
    };

    self.updateItem = function(item){
      var listid = item.listid;
      var itemid = item.itemid();
      myDataRef.child(listid).child("items").child(itemid).child('item').set(item.newitem());
      self.toggleEditor(item);
    };

    self.toggleEditor = function(item){
      var itemid = item.itemid();
      $('#item_text'+itemid).toggle();
      $('#item_edit'+itemid).toggle();
      $('#item_delete'+itemid).toggle();
    };
  };

  function ListModel(snapshot) {
    var self = this;
    self.listid = ko.observable(snapshot ? snapshot.name() : '');
    //self.author = ko.observable(snapshot ? snapshot.val().username : '');
    self.listname = ko.observable(snapshot ? snapshot.val().listname : '');

    self.items = ko.observableArray();

    // Hook Firebase callbacks

    // List item added
    myDataRef.child(self.listid()).child("items").on('child_added', function(snapshot) {
      self.items.push(new ListItemModel(snapshot));
    });

    // List item updated
    myDataRef.child(self.listid()).child("items").on('child_changed', function(snapshot) {
      var itemid = snapshot.name();
      var len = self.items().length;
      while(len--){
        if(self.items()[len].itemid() == itemid){
           self.items()[len].item(snapshot.val().item);
        }
      }
    });

    // List item deleted
    myDataRef.child(self.listid()).child("items").on('child_removed', function(snapshot) {
      var itemid = snapshot.name();
      var len = self.items().length;
      while(len--){
        if(self.items()[len].itemid() == itemid){
           self.items.splice(len,1);
        }
      }
    });

    self.addNewItem = function(list){
      var listid = list.listid();
      var newitem = $('#newitem'+list.listid()).val();
      myDataRef.child(listid).child("items").push({listid: listid, item: newitem});
      $('#newitem'+list.listid()).val('');
    };

    self.deleteList = function(list){
      var listid = list.listid();
      myDataRef.child(listid).remove();
    };
  };

  var AppViewModel = function(fbRef){
    var self = this;
    self.lists = ko.observableArray();
    self.loggedUser = ko.observable(loggedUser ? loggedUser : 'Jorkki');

    // Hook Firebase callbacks

    // New list added
    fbRef.on('child_added', function(snapshot) {
      self.lists.push(new ListModel(snapshot));
    });

    // Lists deleted
    fbRef.on('child_removed', function(snapshot) {
      var listid = snapshot.name();
      var len = self.lists().length;
      while(len--){
        if(self.lists()[len].listid() == listid){
           self.lists.splice(len,1);
        }
      }
    });

    self.addNewList = function(listData){
      var myDataRef = new Firebase(FIREBASE_ADDR+"/"+userid);
      var listname = $('#listname').val();
      myDataRef.push({listname: listname});
      $('#listname').val('');
    };

    self.displayLogin = function(){
      auth.login("facebook");
    };

    self.logout = function(){
      auth.logout();
    };

  };


