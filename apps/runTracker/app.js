var counter = 0;
var counterInterval;


var running = false;


Bangle.loadWidgets();
Bangle.drawWidgets();

var Layout = require("Layout");
/*
* A `type` field of:
  * `undefined` - blank, can be used for padding
  * `"txt"` - a text label, with value `label` and `r` for text rotation. 'font' is required
  * `"btn"` - a button, with value `label` and callback `cb`
       optional `src` specifies an image (like img) in which case label is ignored
  * `"img"` - an image where `src` is an image, or a function which is called to return an image to draw.
       optional `scale` specifies if image should be scaled up or not
  * `"custom"` - a custom block where `render(layoutObj)` is called to render
  * `"h"` - Horizontal layout, `c` is an array of more `layoutObject`
  * `"v"` - Veritical layout, `c` is an array of more `layoutObject`
* A `id` field. If specified the object is added with this name to the
  returned `layout` object, so can be referenced as `layout.foo`
* A `font` field, eg `6x8` or `30%` to use a percentage of screen height
* A `wrap` field to enable line wrapping. Requires some combination of `width`/`height`
  and `fillx`/`filly` to be set. Not compatible with text rotation.
* A `col` field, eg `#f00` for red
* A `bgCol` field for background color (will automatically fill on render)
* A `halign` field to set horizontal alignment. `-1`=left, `1`=right, `0`=center
* A `valign` field to set vertical alignment. `-1`=top, `1`=bottom, `0`=center
* A `pad` integer field to set pixels padding
* A `fillx` int to choose if the object should fill available space in x. 0=no, 1=yes, 2=2x more space
* A `filly` int to choose if the object should fill available space in y. 0=no, 1=yes, 2=2x more space
* `width` and `height` fields to optionally specify minimum size
*/

var runningLayout = new Layout({
    type: "v",
    c: [{
            type: "h",
            pad: 10,
            c: [{
                type: "txt",
                font: "20%",
                label: "-",
                id: "hearthLabel",
                halign: "-1"
            }, ]
        },
        {
            type: "h",
            pad: 0,
            c: [{
                    type: "v",
                    valign: -1,
                    c: [{
                            type: "txt",
                            font: "8%",
                            label: "Pace",
                            id: "paceLabel",
                            halign: -1
                        },
                        {
                            type: "txt",
                            font: "15%",
                            label: "00.00",
                            id: "paceVal",
                            halign: 1
                        },
                    ]
                },
                {
                    type: undefined,
                    pad: 15,
                    id: "filler",
                    halign: 0
                },
                {
                    type: "v",
                    halign: 1,
                    c: [{
                            type: "txt",
                            font: "8%",
                            label: "AvgPace",
                            id: "avgPaceLabel",
                            halign: 1
                        },
                        {
                            type: "txt",
                            font: "15%",
                            label: "00.00",
                            id: "avgPaceVal",
                            halign: 1
                        },
                    ]
                },
            ]
        },
        {
            type: "h",

            pad: 0,
            c: [{
                    type: "v",
                    valign: 1,
                    c: [{
                            type: "txt",
                            font: "8%",
                            label: "Distance",
                            id: "distLabel",
                            halign: -1
                        },
                        {
                            type: "txt",
                            font: "15%",
                            label: "00.00",
                            id: "distVal",
                            halign: 1
                        },
                    ]
                },

                {
                    type: undefined,
                    pad: 15,
                    id: "filler",
                    halign: 0
                },

                {
                    type: "v",
                    halign: 1,
                    c: [{
                            type: "txt",
                            font: "8%",
                            label: "Time",
                            id: "timeLabel",
                            halign: 1
                        },
                        {
                            type: "txt",
                            font: "15%",
                            label: "00.00",
                            id: "timeVal",
                            halign: 1
                        },
                    ]
                },
            ]
        }
    ]
});



var prepLayout = new Layout({
    type: "v",
    c: [{
            type: "v",
            pad: 10,
            c: [{
                type: "txt",
                font: "20%",
                label: "-",
                id: "hearthLabel",
                halign: 0
            },
               {
                    type: "txt",
                    font: "15%",
                    label: "Waiting for\nGPS signal",
                    id: "gpsLabel",
                    halign: 0,
                    valign: 0 
                }
               ]
        },
        {
            type: "h",
            halign : -1,
            pad: 0,
            c: [{
                    type: "v",
                    c: [{
                            type: "txt",
                            font: "8%",
                            label: "Sattelites",
                            id: "satLabel",
                            halign: -1
                        },
                        {
                            type: "txt",
                            font: "15%",
                            label: "0",
                            id: "satVal",
                            halign: 1
                        },
                    ]
                },

                {
                    type: undefined,
                    pad: 20,
                    id: "filler",
                    halign: 0
                },

            ]
        }
    ]
},{btns:[
  {label:"Start/stop", cb: l=> btnPress()}
]
  });







///////////////////////////////////////////////////////////////////////////////////
// Hearth rate stuff
///////////////////////////////////////////////////////////////////////////////////

Bangle.setHRMPower(1);

var lastKnownHRM = 0;

Bangle.on('HRM', function(hrm) {
  //print("newHRM", hrm);
  lastKnownHRM = hrm.bpm;
  
  /*
  if (running) { 
    updateLayoutLocal(runningLayout, "hearthLabel", pretty(hrm.bpm));
  } else {
    updateLayoutLocal(prepLayout, "hearthLabel", hrm.bpm);
    
  //  print(prepLayout["hearthLabel"])
    // prepLayout.clear(prepLayout.hearthLabel);
    //prepLayout.hearthLabel.label = hrm.bpm;
    //prepLayout.render(prepLayout.hearthLabel);
    
  }
  */

});
///////////////////////////////////////////////////////////////////////////////////

function pretty(input){
  return ("  " + input + "   ");
}

function renderLayout(){
  g.clear();
  
  if (running) { 
    prepLayout.clear();
    runningLayout.render();
  } else { 
    runningLayout.clear();
    prepLayout.render();
  }

  Bangle.drawWidgets();

}

  




///////////////////////////////////////////////////////////////////////////////////
// GPS stuff
///////////////////////////////////////////////////////////////////////////////////
Bangle.setGPSPower(1);



//Bangle.on('GPS-raw', function(nmea) {
//   print('nmea:', nmea);
//});

var canStart = false;

var prevPos;
var currPos;

var totalDistance = 0;
var totalTime = 0;
var currentTime = 0; 
var previousTime = 0;

var prevPaceTime = 0; // For keeping track of the pace
var prevPaceDistance = 0;

Bangle.on('GPS', function(gps) {
  if (showingMenu) {return;}
  //print(gps);
  
  prevPos = currPos;
  currPos = gps;
  
  previousTime = currentTime;
  currentTime = gps.time;
  
  
  
  // Preparation stage
  ////////////////////////////////////////////////////////////////////////////
  if (!running) {  
    // Check if we have a valid GPS
    if (!isNaN(currPos.lat) && !isNaN(currPos.lon)) { 
      updateLayoutLocal(prepLayout, "gpsLabel", "Ready to \nStart");
      if (!canStart) {Bangle.buzz(250,1);}
      canStart = true;
    } else if (canStart) {
      updateLayoutLocal(prepLayout, "gpsLabel", "Waiting for\nGPS signal");
      canStart = false;
    }

    
    updateLayoutLocal(prepLayout, "satVal", currPos.satellites);
    updateLayoutLocal(prepLayout, "hearthLabel", lastKnownHRM);
    
    renderLayout();
    
   } else {
     updateLayoutLocal(runningLayout, "hearthLabel", lastKnownHRM);
     renderLayout();
   }
  ////////////////////////////////////////////////////////////////////////////
  
   ////////////////////////////////////////////////////////////////////////////
  
  
  


  if ( isNaN(currPos.lat) || isNaN(currPos.lon) ) { return; } // Don't update if GPS is not valid
  if ( isNaN(prevPos.lat) || isNaN(prevPos.lon) ) { return; } // Don't update if GPS is not valid
  if (( typeof gps.time === "undefined") || ( typeof prevPos.time === "undefined")) { return; }

  if (running) {  
    var localDistance = deltaCoordinates(prevPos.lat, prevPos.lon, currPos.lat, currPos.lon);
    print(`Distance delta ${localDistance}`);
    
    
    
    // Update the distance & time:
    /////////////////////////////////////////////////////////////////////////////////
    totalDistance += localDistance;
    print("TotalDistance", totalDistance);
    totalTime += (currPos.time - prevPos.time)/1000;
    updateLayoutLocal(runningLayout, "distVal", totalDistance.toFixed(2));
    
    if (totalTime < 3600) {
      // Show minutes:seconds
      updateLayoutLocal(runningLayout, "timeVal", `${formatTime(Math.floor(totalTime/60) % 60)}:${formatTime(Math.floor(totalTime % 60))}`);
    } else {
      // Show hours:minutes
      updateLayoutLocal(runningLayout, "timeVal", `${formatTime(Math.floor(totalTime/3600))}:${formatTime(Math.floor(totalTime/60) % 60)}`);
    }
    
    
    
    /////////////////////////////////////////////////////////////////////////////////
    
    
    // Update the average pace: 
    /////////////////////////////////////////////////////////////////////////////////
   
    let avgPace = totalTime/totalDistance;
     print('avgpace', totalDistance, totalTime, avgPace );
    updateLayoutLocal(runningLayout, "avgPaceVal", `${formatTime(Math.floor(avgPace/60) % 60)}:${formatTime(avgPace % 60)}`);
    /////////////////////////////////////////////////////////////////////////////////
    
    
    
    
    // Update the 1 km pace:
    /////////////////////////////////////////////////////////////////////////////////
    if (Math.floor(totalDistance) > prevPaceDistance) {
      let timePassed = (totalTime - prevPaceTime);
      
      updateLayoutLocal(runningLayout, "paceVal", `${formatTime(Math.floor(timePassed/60) % 60)}:${formatTime(timePassed % 60)}`);
      
      prevPaceTime = totalTime;
      PrevPaceDistance = Math.floor(totalDistance);
      
      //E.showMessage("Out of Time", "Timer");
    }
    /////////////////////////////////////////////////////////////////////////////////
    
  }
  renderLayout();
  

});

///////////////////////////////////////////////////////////////////////////////////

function formatTime(inputNumber){
  return ("0" + inputNumber).slice(-2);
}




function btnWatcher(){
  print('button presses')
  setWatch(btnWatcher, (process.env.HWVERSION==2) ? BTN1 : BTN2)
}

setWatch(btnWatcher, (process.env.HWVERSION==2) ? BTN1 : BTN2)

var showingMenu = false
Bangle.on('swipe', function(direction) {
  if (direction === -1) {
    showingMenu = true;
    // Set screen to old recordings
    var mainMenu = {
  "" : { "title" : "-- Recordings  --" }, // no effect?
  "Item 1" : function() { undefined; },
  "Item 2" : function() { undefined; },
  "Item 3" : function() { undefined; },
  "Item 4" : function() { undefined; },
  "Item 5" : function() { undefined; },
  "Item 6" : function() { undefined; },
  "Item 7" : function() { undefined; },    
};
E.showMenu(mainMenu);
  } if (direction === 1) {
    showingMenu = false;
    //Set screen to waiting for GPS 
  }
  
  //print('swipe', direction);
});

function updateLayoutLocal(layoutObject, localLabel, newVal) {
  // Example: updateLayoutLocal(prepLayout, "gpsLabel", "Ready to \nStart")
  layoutObject.clear(layoutObject[localLabel]);
  layoutObject[localLabel].label = newVal;
  layoutObject.render(layoutObject[localLabel]);
}



function btnPress(){
  print ("button pressed");
  
  // Preparation stage and no valid gps:
  if (!running && !canStart) {print("Cannot start!"); return;}
  
  
  // Start/stop measurement
  running = !running;
  

  renderLayout();
  
}

//setWatch(btnPress, (process.env.HWVERSION==2) ? BTN1 : BTN2);

g.clear();
Bangle.drawWidgets();
renderLayout();




function deltaCoordinates(lat1, lon1, lat2, lon2) {
  // https://en.wikipedia.org/wiki/Geographic_coordinate_system
  let latMid = (lat1+lat2 )/2.0;  // or just use Lat1 for slightly less accurate estimate

  let m_per_deg_lat = 111132.92 - 559.82 * Math.cos(2.0 * latMid) + 1.175 * Math.cos(4.0 * latMid) - 0.0023 * Math.cos(6  * latMid);
  let m_per_deg_lon = (3.14159265359/180 ) * 6367449 * Math.cos ( latMid );


  let deltaLat = Math.abs(lat1 - lat2);
  let deltaLon = Math.abs(lon1 - lon2);

  return (Math.sqrt (Math.pow( deltaLat * m_per_deg_lat,2) + Math.pow( deltaLon * m_per_deg_lon , 2) ))/1000;

}








function startBaro() {
  Bangle.getPressure().then((PTHreading) => {
      g.clear();
  
    g.setFontAlign(0,0);
    g.setFont("Vector", 20);
    g.drawString(`Temp: ${PTHreading.temperature.toFixed(2)}`, g.getWidth()/2, g.getHeight()/4);
    g.drawString(`Press: ${PTHreading.pressure.toFixed(2)}`, g.getWidth()/2, 2*g.getHeight()/4);
    g.drawString(`Alt: ${PTHreading.altitude.toFixed(2)}`, g.getWidth()/2, 3*g.getHeight()/4);

    
    Bangle.drawWidgets();
  });
                            

}






  

 
