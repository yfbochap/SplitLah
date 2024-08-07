# SplitLah!
A Bill Splitting App for people to keep track of multiple bills and facilitate easy payment across groups.

## Type
Mobile App

## Motivation/Problem
When going out with friends, managing group expenses often becomes a cumbersome task. The process of taking turns in bill payment leads to confusion regarding individual contributions and manually adding up receipts to calculate total expenses proves to be time-consuming and error-prone. 

## What does our project set out to accomplish?
Introducing SplitLah!, a comprehensive mobile application designed to streamline and simplify the management of group expenses during travel. This intuitive platform offers a seamless solution for tracking individual contributions, consolidating bills, and generating group expense breakdowns, ultimately enhancing the overall experience for everyone! :D (patent pending...)

##  Is this app for you?
If you are looking for a fuss free and convenient solution to keep track of multiple payments then this is the app for you!

## Features
1. Expense Tracking: Effortlessly record individual expenses incurred during the trip. Users can input various expenses in different currencies for easy tracking.
2. Splitting bills: Facilitate fair and transparent bill splitting among group members by assigning expenses to specific individuals or dividing them equally among the group. Eliminating the need for manual calculations
3. Real-time updates: Keep track of shared expenses in real-time, allowing users to monitor contributions, outstanding balances, and settlement status throughout the trip
4. Group Chat: Talk to your friends through our app instead of fumbling around with multiple applications
5. Debt Tracking: Our app offers graphical representation of your debts and also simplifies the reimbursement process

## TechStack
1. ReactNative (TypeScript)
2. Expo
3. Supabase (PostgreSQL)

## (For Android devices and people who just want to use the app)
Download the APK file [here](https://expo.dev/accounts/wongyh/projects/SplitLah/builds/392c8b8b-55c1-403e-bb1f-31429a7780cb)

## Set-Up instructions (For developers)
1. Installing Node.js and NPM installer
   <br><br> <i>INSTRUCTIONS FOR MAC USERS:</i> <br><br>
    a. Install Node Using .pkg Installer. Node provides a .pkg installer for Mac. Besides, we can also download from its [official website](https://nodejs.org/en/download/)
   
    b.	Click on the “ macOS Installer ” option to download the .pkg installer. Make sure you download it to your desired location.
   
    c.	Installer is ready to run:
       i.	Introduction > Continue License > Select Continue > Agree Installation Type > Install > Authenticate with your Mac to allow the Installation > Install Software Summary > Close
   
   <br><br> <i>INSTRUCTIONS FOR WINDOWS USERS:</i> <br><br>
    a.	Download the Windows Installer from NodeJs [official website](https://nodejs.org/en/download/). Make sure you have downloaded the latest version of NodeJs. It includes the NPM package manager.
     
    b.	The LTS (Long-term Support) version is highly recommended for you. After the download of the installer package, install it with a double-click on it.
     
    c.	Now .msi file will be downloaded to your browser. Choose the desired location for that.

    d.	After choosing the path, double-click to install .msi binary files to initiate the installation process. Then give access to run the application.

    e.	You will get a welcome message on your screen and click the “Next” button. The installation process will start.

    f.	Choose the desired path where you want to install Node.js.
     
    g.	By clicking on the Next button, you will get a custom page setup on the screen. Make sure you choose npm package manager , not the default of Node.js runtime . This way, we can install Node and NPM simultaneously.
     
    h.	Click on the install button.

3. DM @YF_Leong for `.env` file
4. Insert `.env` file in SplitLah project directory
5. Install dependencies: `npm install` (Make sure that you are running this command in the SplitLah directory! We would recommend opening a terminal in VScode and running the commands there)
6. Download Expo Go app on App Store or Play Store (WARNING: Some features do not work well on IOS devices). Alternatively, you can choose to use an android emulator if you wish. Replace step 9 by simply pressing 'a' on your terminal instead of scanning the QR code.
7. Please make an [Expo](https://expo.dev/) account, you will be prompted to sign in at a later step.
8. Make sure you are in the SplitLah project directory in terminal and run `npx expo start`
9. The terminal (on your computer) should prompt you stating that 'An Expo user account is required to proceed'. Please sign in accordingly within a few minutes or the connection will timeout. If you are using the Expo Go app, please ensure that both your computer and mobile device are on the same network. Router settings/security may cause issues at times, so you may need to use your hotspot.
10. For Android:
   Open your Expo Go app and scan the QR code shown in your terminal
   <br>
   For IOS:
   Open Camera App and scan the QR code shown in your terminal and you should be redirected to the Expo Go app
11. Upon successfully signing in, you should see a loading bar indicating the status of the package bundling in the terminal. Your phone should also be showing the application splash screen.
12. Once the loading completes, the app should display on your phone!
