class Meeting{
    constructor(name,day,time,user) {
    StaticValidator.validate_type({'string':[name,day,time],'User':user})
    StaticValidator.validate_empty(name,day,time)
    this.name = name;
    this.day = day;
    this.time = time;
    this.user = user;
  }
}


class User{
  constructor(user_name) {
    StaticValidator.validate_type({'string':user_name})
    StaticValidator.validate_empty(user_name)
    this.user_name = user_name;
  }
}

class StaticValidator{
  static validate_type(args) {
    for (var key in args){
      if (args[key] instanceof Array){
        
        for (var k in args[key])
        {
          if (!(typeof args[key][k] == key || (args[key][k] instanceof User))){
            throw `${key} must be typed as ${typeof(args[key][k])}`
          }
        }
      }
    } 
  }
  static validate_empty(...args) {
    args.forEach(function(items) {
      if (items.length == 0 || items == undefined){throw `element must not be empty`}
    })
  }
 
}

document.getElementById('createMeetingButton').addEventListener('click',function(){
  document.getElementById('CreateMeatingid').style.display = 'block';
  //document.querySelector('.headerblock').style.display = 'none';
  //document.querySelector('.table-bordered').style.display = 'none';

})

function inDataBase(meeting_day,meeting_time){
  var arrofMeetings = loadObj()
  if(arrofMeetings != null){
    for (var i =0;i < arrofMeetings.length;i++){
      if (arrofMeetings[i].day == meeting_day && arrofMeetings[i].time == meeting_time)
        return true
    }
  }
  return false
}


document.getElementById('AddtoLocal').addEventListener('click',function(){
  
  var event_name = document.getElementById('inputEventName').value
  var user_list = document.querySelector('.filter-option-inner-inner').innerHTML
  var meeting_day = document.getElementById('dayofweek').value
  var meeting_time = document.getElementById('timeofmeeting').value
  if (!(inDataBase(meeting_day,meeting_time))){
    var user = new User(user_list)
    var meeting = new Meeting(event_name,meeting_day,meeting_time,user)
    saveObj(meeting)
  }
  /*else{
    alert('Failed to create the event. Slot has already been taken')
  }*/
})


function loadObj(){
  var arrofMeetings = []
  var retrievedObject = localStorage.getItem('SetofMeetings');
  if (localStorage.getItem("SetofAuSetofMeetingsthors") != null) {
    arrofMeetings=JSON.parse(retrievedObject)
    return arrofMeetings
  }
  return JSON.parse(retrievedObject)
}

function saveObj(object){

  // Retrieve the object from storage
  var arrofMeetings = []
  var retrievedObject = localStorage.getItem('SetofMeetings');
  
  if (localStorage.getItem("SetofMeetings") != null) {
    arrofMeetings=JSON.parse(retrievedObject)
  }

  arrofMeetings.push(object)
  // Put the object into storage
  localStorage.setItem('SetofMeetings', JSON.stringify(arrofMeetings));
  location.reload();

}

function getFirstWord(codelines){
  return codelines.slice(0,5)
}

function ClearState(){
  var tbody = document.getElementsByTagName('tbody')
  for (var i =0;i < tbody[0].children.length;i++){
    for (var j =1;j < tbody[0].children[i].children.length;j++){
      
      while (tbody[0].children[i].children[j].firstChild) {
        tbody[0].children[i].children[j].style.backgroundColor = '#FFFFFF'
        tbody[0].children[i].children[j].removeChild(tbody[0].children[i].children[j].lastChild);
      }
    }
  }
}


document.getElementById('meetingMadeFor').addEventListener('change',function(){
  ClearState()
  var arrofMeetings = loadObj()
  var showtoWho = document.getElementById('meetingMadeFor').value
  if (showtoWho == "All"){
    location.reload();
  }
  var tbody = document.getElementsByTagName('tbody')
    for (var i =0;i<arrofMeetings.length;i++){
        if (arrofMeetings[i].user.user_name.indexOf(showtoWho) != -1){
        for (var j =0;j<tbody[0].children.length;j++){
          if (getFirstWord(tbody[0].children[j].innerText) == arrofMeetings[i].time){
            for (var k =1;k<tbody[0].children[j].children.length;k++){
              if (tbody[0].children[j].children[k].className == arrofMeetings[i].day){
                span = document.createElement('span')
                ielem = document.createElement('i')
                span.innerHTML =arrofMeetings[i].name
                span.innerText=arrofMeetings[i].name
                ielem.className ='fa fa-times'
                ielem.style.paddingLeft = '20px'
                tbody[0].children[j].children[k].style.backgroundColor = '#00C9A7'
                tbody[0].children[j].children[k].appendChild(span)
                tbody[0].children[j].children[k].appendChild(ielem)
                ielem.addEventListener('click',function(){
                  var arrofMeetings = loadObj()
                  for (var i=0;i<arrofMeetings.length;i++){
                    if (arrofMeetings[i].day == event.path[1].className && arrofMeetings[i].name == event.path[1].childNodes[0].innerHTML){
                      arrofMeetings.splice(i,1)
                      localStorage.setItem('SetofMeetings', JSON.stringify(arrofMeetings));
                      location.reload();
                    } 
                  }
                })
              }
            }
          }
        }
      }
    }
})



window.onload = function() {
  var arrofMeetings = loadObj()
  var showtoWho = document.getElementById('meetingMadeFor').value
  var tbody = document.getElementsByTagName('tbody')//tbody.children.innerText
  if (showtoWho == 'All' && arrofMeetings != null){
    for (var i =0;i<arrofMeetings.length;i++){
      for (var j =0;j<tbody[0].children.length;j++){
        if (getFirstWord(tbody[0].children[j].innerText) == arrofMeetings[i].time){
          for (var k =1;k<tbody[0].children[j].children.length;k++){
            if (tbody[0].children[j].children[k].className == arrofMeetings[i].day){
              span = document.createElement('span')
              ielem = document.createElement('i')
              span.innerHTML =arrofMeetings[i].name
              span.innerText=arrofMeetings[i].name
              ielem.className ='fa fa-times'
              ielem.style.paddingLeft = '20px'
              tbody[0].children[j].children[k].style.backgroundColor = '#00C9A7'
              tbody[0].children[j].children[k].appendChild(span)
              tbody[0].children[j].children[k].appendChild(ielem)
              ielem.addEventListener('click',function(){
                if (window.confirm(`Are you sure you want to delete ${event.path[1].childNodes[0].innerHTML}`)) {
                  var arrofMeetings = loadObj()
                  for (var i=0;i<arrofMeetings.length;i++){
                    if (arrofMeetings[i].day == event.path[1].className && arrofMeetings[i].name == event.path[1].childNodes[0].innerHTML){
                      arrofMeetings.splice(i,1)
                      localStorage.setItem('SetofMeetings', JSON.stringify(arrofMeetings));
                      location.reload();
                    } 
                  }
                }
              })
            }
          }
        }
      }
    }
  }

}
