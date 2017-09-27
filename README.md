# Planner für DHBW

Live version at https://planner.chagemann.de/

## Goals
Planner für DHBW is a web app that displays course information for DHBW Mosbach students. Current events and news pertaining to the StuV are also displayed.  
A future goal is making general information available for students of the DHBW Mosbach.

Currently, a [website with the courses](https://stuv-mosbach.de/survival/index.php?main=8&course=inf16b)
and a [native Android App](https://play.google.com/store/apps/details?id=de.stuv_mosbach.stuvapp) exist.

As far as I know, the iOS version of the app does not have all features of the Android one. There
are no developers yet that have taken their time to tackle this issue.

My idea was to have a web app that can be developed once and then distributed and used on the three major
platforms - Web, Android and iOS.

So far I'm aiming to get close to a feature parity with the Android app.

The following is a list of functional requirements:

- [x] Display the courses (From the DHBW, `.ics` files) of a module
- [x] Tab with current events organized by the StuV (Google Calendar, JSON API), possibly other events that may be interesting for students
- [x] Tab with current news from the StuV (RSS/JSON Feed on a WordPress instance)
- [x] Display links to the Studierendenwerk for general information stuff
- [ ] Display courses and events of the next two days in an "Aktuell" tab
- [ ] At lunch times, show a button to open the Mensaplan

 


---
Had to add a proxy between the app and the DHBW calendar servers because js wants a CORS header. `caddy`'s proxy module
does just that.

LICENSE has to be added yet, but it will probably be GPL-3-licensed just like the Android app.

## Build
Building the app is pretty easy, you just need a working `node.js` and `npm` setup on your machine.  
Not exactly sure which version is needed, just get one of the latest ones and it should work.

``` bash
npm install

# start a local webserver and run the app
npm run dev

# build for production
npm run build
```
