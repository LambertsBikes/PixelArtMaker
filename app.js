/* ## artPresent function ##
Check if there is already any art work on the canvas and provide user confirmation before wiping existing art work.
*/
function artPresent(){
  var colouredPixels = 0;
  $("#pixelCanvas td").each(function(){         // loop through each cell/pixel in table with ID = pixelCanvas
    bgColor = $(this).css("background-color");  // set variable 'bgColor' background color of current cell/pixel
    if(bgColor !== "rgb(255, 255, 255)"){       // check bgColor variable against default (white).
      colouredPixels ++; }                      // - if color is not the same as default (white) increment 'coloured pixel count' integer
  });
  if(colouredPixels > 0){                       // if the number of coloured pixels is greater then 1, create a message to display in UI
    if (colouredPixels > 1){
      message = "There are " + colouredPixels + " painted pixels on the canvas\n";
    } else {
      message = "There is " + colouredPixels + " painted pixel on the canvas\n"; }
    message += "Are you sure you want to create a new grid?";
    if (confirm(message) == true) {
      return true;            // return true if user is happy to overwrite existing artwork
    } else {
      return false;           // else, return false if user does NOT want to overwrite existing artwork
    }
  } else {
    return true; }            // return false if there are no pixels colored differently to the default (white) [colored pixels integer vairable === 0]
}
/* ## responsiveMax function ##
Check the screen size and return a fixed maximum input value for restricting table size to maintaining usability
*/
function responsiveMax(){
  if ($(window).width() <= 640){
    return 25; // phone
  } else if ($(window).width() <= 960){
    return 50; // tablet
  } else {
    return 75; // PC
  }
}
/* ## maxDimensions function ##
From the screen orientation and size ratio, determine the maximum height and width input values that maintain usability
*/
function maxDimensions(){
  var maxHeight, maxWidth;
  if ($(window).width() > $(window).height()){                                    // check if landscape viewport (width > height)
    maxHeight = responsiveMax();                                                  // - get fixed value for maximum height
    maxWidth = Math.floor(maxHeight * ($(window).width() / $(window).height()));  // - then determine maximum width from screen size ratio
  } else {                                                                        // else assume portrait oriented viewport
    maxWidth = responsiveMax();                                                   // - get fixed value for maximum width
    maxHeight = Math.floor(maxWidth * ($(window).height() / $(window).width()));  // - then determine maximum height from screen size ratio
  }
  return [maxHeight, maxWidth];                                                   // return determined values for the maxium table height and width input values
}
/* ## sizeCheck function ##
Check the inputted values against function determined maximum input values. If inputs exceed the maximums, return alert with maximum input values.
*/
function sizeCheck(){
  var maxHeight = maxDimensions()[0];
  var maxWidth = maxDimensions()[1];
  if ($('input[name="height"]').val() > maxHeight || $('input[name="width"]').val() > maxWidth){
    message =  "Selected grid is too big for your screen.\nMaximum Height = " + (maxHeight) + "\nMaximum Width = " + (maxWidth);
    alert(message);
    return false;
  } else {
    return true;  // size OK
  }
}
/* ## makeGrid function ##
Makes a new grid (starts from fresh).
#1 Removes, any rows from table with ID pixelCanvas.
#2 Creates new table with height and width equal to input values.
Each row is given an ascending ID, which is used to insert the pixels in the correct row.
*/
function makeGrid(){
  var newHeight = $('input[name="height"]').val();
  var newWidth = $('input[name="width"]').val();
  $("#pixelCanvas tr").remove();                    // remove old grid by removing table row elements & contents
  for (var row = 1; row <= newHeight; row++){       // loop for number equal to inputted height value - starting at 1
    var rowHTML = '<tr id="row' + row + '"></tr>';  // create row element HTML code, giving each row a unique asecnding ID
    $("#pixelCanvas").append(rowHTML);              // append row HTML as last child to pixelCanvas (tbody)
    for (var col = 1; col <= newWidth; col++){            // run nested loop for number equal to inputted width value - starting at 1
      $(("#row" + row)).append('<td class="pixel"></td>') // append tabel cell/pixel HTML as last child to table row (tr), giving cell (td) each the class 'pixel'
    }
  }
}
/* ## responisvePixels function ##
Modify the CSS to ensure that the pixels fit inside the view point and remain square in shape.
Each pixel is given a size relative to either the viewport orientation or, in the case of wide or tall rectanglular shaped grids, the best fit solution.
*/
function responsivePixels(){
  var maxHeight = maxDimensions()[0];
  var maxWidth = maxDimensions()[1];
  var vh, vw, unit;
  if ($(window).width() > $(window).height()){                     // check if landscape viewport (width > height)
    unit = "vh";                                                   // - assume relative height unit is best fit
    vh = Math.floor(90 / $('input[name="height"]').val());         // - maximum viewport fill % divided by input
    vw = Math.floor(maxWidth / $('input[name="width"]').val());    // - maximum input value divided input value
  } else {                                                         // else, assume screen orientation is portratit.
    unit = "vw";                                                   // - assume relative width unit is best fit
    vw = Math.floor(90 / $('input[name="width"]').val());          // - maximum viewport fill % divided by input
    vh = Math.floor(maxHeight / $('input[name="height"]').val());  // - maximum input value divided input value
  }
  if (vw < vh){         // if relative width unit is best fit
    vh = vw;            // - set height to equal width to keep pixles square
  } else {              // else, make relative height unit is best fit
    vw = vh;            // - set width to equal height to keep pixles square
  }
  vh += unit;           // append unit to height value
  vw += unit;           // append unit to width value

  $(".pixel").css({     // add pixel dimensions as style css to each table cell/pixel
    "height": vh,
    "width": vw});
}
/* ## submit button click event listener ##
Listens for the submit button to be pressed.
#1 Checks for any present art work and varifies input values maintain usability. If checks prove true continue to #1A & #1B
  #1A Make a new table with size equal to user input dimensions
  #1B Add CSS to make pixel sizing responsive
#2 Prevents default HTML being loaded after submit button event (keeping JavaScript ammendments visible)
*/
$("#sizePicker").submit(function(event){
  if (artPresent() && sizeCheck()){ // #1
    makeGrid();                     // #1A
    responsivePixels();             // #1B
  }
  event.preventDefault();           // #2
});
/* ## table cell click event listener ##
Color user clicked pixel with user selected color
*/
$("#pixelCanvas").on("click", "td", function(event){
  var paint = $('input[name="colorPicker"]').val();   // get colour value from users colorPicker
  $(this).css("background-color", paint);             // set background colour of clicked pixel via .CSS
});
