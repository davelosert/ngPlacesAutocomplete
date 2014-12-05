ngPlacesAutocomplete
====================

A simple Directive to easily add the autocomplete feature of the Google Places Service to a Textbox. 
Feel free to contribute or leave an issue here on Github if you are missing functionality or want to report
a bug.

####Current Version: 1.2.2

### News
**05 Dec 2014:**
I implemented another option "prevenSubmit" which will check the input-searchfield for a search-execution with "enter". This prevents
a search being fired twice if the input-searchfield is embedded within a form-element with a input-type "submit".

**18 Oct 2014:**
I discovered a weird behaviour with the Model-Update: Due to the focus on the text element after executing a search, the
model somehow didnt adjust properly and would go back to the actual search string (instead of the found place) after blurring.
I fixed this by just manually blurrying the textfield after a search execution. 

**12 Oct 2014:**
I now implemented a way to synchronize the text-input with the returned result after a search. I made it configurable
by extending the `paOptions`-Object with the property `updateModel`. Additionally, i made the watcher for the options
configurable by passing true to `watchOptions` also inside the `paOptions`-Object. It all became a little messy now so
the next steps are to implement some tests and refactor some parts of the directive to make it clean again.


**06 Oct 2014:**
As of today, I advanced the directives functionality with text-based search, meaning a user can type in any String now
and it will get resolved to a Place-Object. I still need to adjust the documentation though. The next step will be to
write an additional directive with which this text search can be manually triggerd (e.g. on submit of a form or click 
of a button). 

##How to use

First download the directive, either with `bower` or `npm`:

    npm install ng-places-autocomplete --save

or 

    bower install ng-places-autocomplete --save

Then refer it inside your index.html, careful to do this **after** the Google-Javascript-API and Angular, but **before** your 
app.js:

```HTML
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
<script src="../bower_components/angular/angular.min.js"></script>
<script src="../ngPlacesAutocomplete.min.js"></script>
<script src="app.js"></script>
```

Just use it as a HTML-Attribute on a text-input as you would every other directive:

```HTML
<input  type="text" 
        ng-model="query"
        ng-places-autocomplete 
        pa-options="optionsObject" 
        pa-trigger="triggerFunc"
        pa-on-place-ready="callbackFunction"
/> 
```

##API
The directive needs an **ngModel** set and further offers three attributes:

**paOnPlaceReady** - Expects a NodeJS-Style Callback-Function that gets executed everytime a user chose a place from the autocomplete-window. The first parameter is either
an error if one occured or null. The second one is the recieved Places-Object as specified [here](https://developers.google.com/maps/documentation/javascript/reference?hl=FR#PlaceResult).

**paOptions** (optional) - The Options Object to configure the autocomplete-service. It takes the exact same values as
the Google-Places-Service described [here](https://developers.google.com/maps/documentation/javascript/reference#AutocompleteOptions). 
Additionally, you can pass the following, directive-specific options:

* **updateModel** - Set this to true if you want the directive to always update the ngModel and textboxes input value with the found results full address. (e.g. typed in "Wash" will become "Washington, USA")
* **watchOptions** - Set this to true if you want your options-object being watched for changes. Else they will only be set once. Be aware that every watcher can slow down the performance of your app.

**paTrigger** (optional) - If you pass a variable to paTrigger, the directive will assign the function to execute a manual search for the currently
typed in query-string to it. You can then easily use the value and put it inside the ng-click of a button to have an additional search trigger (`<button ng-click="triggerFunc()">Search</button>"`)


##Todos
* Write some tests
* Add more examples which actually used options
* Implement "bind" option for bounds of map


##License
Copyright (c) \<2014\> \<David Losert\>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
