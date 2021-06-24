
## HokuBot

Twitch, Discord, YouTube, Firestore, Web Control Panel API Utility

Google Firebase Asset + API Query/Crawler Control Panel

Example and full source for your own Firebase hosted app.


#Caveats include:

Full Auth Firebase DB Schema
Daily Dictionary Web Scraping
Daily YouTube API Scraping
Daily Discord Announcements
Twitch Announcements & Commands
High-Scaling (10,000+ Items) Kanban-like To-Do Manager 


# How to use it:

1.) Download these source files and copy them in your chosen working directory

2.) Sign-up for Firebase:
http://firebase.com/

3.) Initialize your firebase project and emulators in your chosen working directory with nodejs firebase-tools and when prompted select the following:
Initialize the project with access to: hosting, firestore, auth, functions
Initialize emulator setup (firebase project init will ask) for localhost development only check functions for emulation
Use /build/ for hosting deployment
do not re-write index.html
do not convert to single-page-application

https://www.google.com/search?q=firebase-tools&rlz=1C1CHBF_enUS918US918&oq=firebase-tools&aqs=chrome..69i57j0l7.2280j0j7&sourceid=chrome&ie=UTF-8

4.) Run `npm i` next to package.json
this run the install process, populating /node_modules/ with the CRA & frameworks listed in package.json

4.) Run `npm run femu` in your chosen working directory next to package.json
this will begin the firebase emulation suite in configuration with ReactJS for hot-reloading, webpack bundling and building (at deployment) to the /build/ folder

5.) The project will launch locally and run the functions console & reactjs console in tandem in the main console through the use of npm-run-all 

6.)Deployment
After you've decided on your setup/changes you can run the following to send your code to firebase hosting and keep your app live 24/7:

`npm run fb`
Builds the minified bundle into /build/ and updates all firebase functions

or
`npm run fbh`
Builds the minified bundle into /build/ 

or
`npm run fbf`
Updates all firebase functions

These options speed up deployment times as the seperate processes each take their own minute or so.


7.) Connect to the HokuBot Network ##WIP
Share your code, functions and features with others through the use of HokuBot rest API server clusters, release your own Discord/Twitter community functions, seamlessly integrate new functions into the community global api list and get credited for your work.




Questions comments & concerns are welcome.


![image](https://user-images.githubusercontent.com/6715569/123181437-ffc7da00-d428-11eb-9bd5-57f934f9ef62.png)


![image](https://user-images.githubusercontent.com/6715569/123181483-1d953f00-d429-11eb-93d6-d244d2ec7050.png)
