
## HokuBot

100% Open-Source Free Quotas Firebase Hosted 24/7 Web & Local JavaScript App

Utilizes Discord, Twitch, YouTube, Firebase, Web Control Panel API Utility

Google Firebase Asset + API Query/Crawler Control Panel

Example and full source for your own Firebase hosted app.


#Caveats include:

- Full Auth Firebase DB Schema With Backend Scheduled CRUD Operations

- Full Backend Powered Open-Source Firestore Driven API Key Setup (Requires API Keys in Firestore Database)

- Daily Dictionary Web Scraping -> Word Of The Day Announcements

- Daily YouTube API Scraping (Utilise free daily YTSearch API quota to announce new YT videos to your channels)

- Daily Discord Announcements (Word of the day, stat reports, random quote)

- Twitch Announcements & Commands (Database driven announcements on timer)

- Kanban-like To-Do Manager -> Firestore DB Task Manager



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


5.) Run `npm run femu` in your chosen working directory next to package.json
this will begin the firebase emulation suite in configuration with ReactJS for hot-reloading, webpack bundling and building (at deployment) to the /build/ folder


6.) The project will launch locally and run the functions console & reactjs console in tandem in the main console through the use of npm-run-all 


7.)Deployment
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



8.) Connect to the HokuBot Network ##WIP
Share your code, functions and features with others through the use of HokuBot rest API server clusters, release your own Discord/Twitter community functions, seamlessly integrate new functions into the community global api list and get credited for your work.




Questions comments & concerns are welcome.


![image](https://user-images.githubusercontent.com/6715569/123181437-ffc7da00-d428-11eb-9bd5-57f934f9ef62.png)


![image](https://user-images.githubusercontent.com/6715569/123181483-1d953f00-d429-11eb-93d6-d244d2ec7050.png)


![image](https://user-images.githubusercontent.com/6715569/123477332-987d6780-d599-11eb-8fc8-a2798d8a89d8.png)


![image](https://user-images.githubusercontent.com/6715569/123477354-a16e3900-d599-11eb-86ad-f3393f0fbb1b.png)

